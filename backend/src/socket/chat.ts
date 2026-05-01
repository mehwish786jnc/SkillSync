/**
 * Socket.io real-time chat server.
 *
 * Auth:     JWT token verified on connection (handshake).
 * Rooms:    Each 1-to-1 chat gets a ChatRoom row; the socket joins the room id.
 * Events:
 *   client → server:
 *     "join_room"    { peerId }             → creates / finds room, joins socket
 *     "send_message" { roomId, content }    → persists + broadcasts to room
 *     "typing"       { roomId }             → broadcasts typing indicator
 *     "stop_typing"  { roomId }             → clears typing indicator
 *   server → client:
 *     "room_joined"  { room, messages }     → initial room state
 *     "new_message"  { message }            → real-time message
 *     "user_typing"  { userId, name }       → typing indicator
 *     "user_stop_typing" { userId }         → clear indicator
 *     "user_online"  { userId }             → presence
 *     "user_offline" { userId }             → presence
 *     "error"        { message }            → error feedback
 */

import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthPayload } from '../middleware/auth';
import prisma from '../config/prisma';
import logger from '../config/logger';

// ── Types ────────────────────────────────────────────────

interface AuthenticatedSocket extends Socket {
  user: AuthPayload & { name: string };
}

// Track online users: userId → Set of socketIds (multi-device support)
const onlineUsers = new Map<string, Set<string>>();

// ── Helpers ──────────────────────────────────────────────

/** Find or create a 1-to-1 chat room between two users */
async function findOrCreateRoom(userIdA: string, userIdB: string) {
  // Look for a room where both users are members
  const existing = await prisma.chatRoom.findFirst({
    where: {
      AND: [
        { members: { some: { userId: userIdA } } },
        { members: { some: { userId: userIdB } } },
      ],
    },
    include: {
      members: { include: { user: { select: { id: true, name: true, avatar: true } } } },
    },
  });

  if (existing) return existing;

  // Create new room with both members
  return prisma.chatRoom.create({
    data: {
      members: {
        create: [{ userId: userIdA }, { userId: userIdB }],
      },
    },
    include: {
      members: { include: { user: { select: { id: true, name: true, avatar: true } } } },
    },
  });
}

/** Load recent messages for a room (paginated from newest) */
async function loadMessages(roomId: string, limit = 50, before?: string) {
  return prisma.message.findMany({
    where: {
      roomId,
      ...(before && { createdAt: { lt: new Date(before) } }),
    },
    include: {
      sender: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  }).then((msgs) => msgs.reverse()); // Return in chronological order
}

/** Verify the user is a member of the room */
async function isRoomMember(roomId: string, userId: string): Promise<boolean> {
  const member = await prisma.chatRoomMember.findUnique({
    where: { roomId_userId: { roomId, userId } },
  });
  return !!member;
}

// ── Socket.io init ───────────────────────────────────────

export function initSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: config.corsOrigin,
      credentials: true,
    },
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  // ── JWT Authentication middleware ──────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token as string | undefined;
      if (!token) return next(new Error('Authentication required'));

      const decoded = jwt.verify(token, config.jwt.secret) as AuthPayload;

      // Fetch user name for display in typing indicators etc.
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { name: true },
      });
      if (!user) return next(new Error('User not found'));

      (socket as AuthenticatedSocket).user = {
        ...decoded,
        name: user.name,
      };

      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  // ── Connection handler ─────────────────────────────────
  io.on('connection', (rawSocket: Socket) => {
    const socket = rawSocket as AuthenticatedSocket;
    const { userId, name } = socket.user;

    logger.info(`Socket connected: ${name} (${userId})`);

    // Track online status
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId)!.add(socket.id);

    // Broadcast online status to all connected clients
    socket.broadcast.emit('user_online', { userId });

    // ── join_room: find/create room with a peer ──────────
    socket.on('join_room', async (data: { peerId: string }) => {
      try {
        const { peerId } = data;
        if (!peerId || peerId === userId) {
          return socket.emit('error', { message: 'Invalid peer' });
        }

        // Verify peer exists
        const peer = await prisma.user.findUnique({
          where: { id: peerId },
          select: { id: true },
        });
        if (!peer) return socket.emit('error', { message: 'User not found' });

        const room = await findOrCreateRoom(userId, peerId);
        const messages = await loadMessages(room.id);

        // Join the socket.io room
        socket.join(room.id);

        socket.emit('room_joined', { room, messages });
      } catch (err) {
        logger.error('join_room error:', err);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // ── send_message: persist + broadcast ────────────────
    socket.on('send_message', async (data: { roomId: string; content: string }) => {
      try {
        const { roomId, content } = data;
        if (!roomId || !content?.trim()) {
          return socket.emit('error', { message: 'Room and content are required' });
        }

        // Verify sender is a member of the room
        if (!(await isRoomMember(roomId, userId))) {
          return socket.emit('error', { message: 'Not a member of this room' });
        }

        // Persist the message
        const message = await prisma.message.create({
          data: {
            content: content.trim(),
            roomId,
            senderId: userId,
          },
          include: {
            sender: { select: { id: true, name: true, avatar: true } },
          },
        });

        // Update room timestamp for sorting
        await prisma.chatRoom.update({
          where: { id: roomId },
          data: { updatedAt: new Date() },
        });

        // Broadcast to everyone in the room (including sender for confirmation)
        io.to(roomId).emit('new_message', { message });
      } catch (err) {
        logger.error('send_message error:', err);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // ── typing indicators ────────────────────────────────
    socket.on('typing', (data: { roomId: string }) => {
      if (data.roomId) {
        socket.to(data.roomId).emit('user_typing', { userId, name });
      }
    });

    socket.on('stop_typing', (data: { roomId: string }) => {
      if (data.roomId) {
        socket.to(data.roomId).emit('user_stop_typing', { userId });
      }
    });

    // ── load_messages: pagination for older messages ─────
    socket.on(
      'load_messages',
      async (data: { roomId: string; before: string; limit?: number }) => {
        try {
          const { roomId, before, limit } = data;
          if (!roomId) return;

          if (!(await isRoomMember(roomId, userId))) {
            return socket.emit('error', { message: 'Not a member of this room' });
          }

          const messages = await loadMessages(roomId, limit || 50, before);
          socket.emit('messages_loaded', { roomId, messages });
        } catch (err) {
          logger.error('load_messages error:', err);
          socket.emit('error', { message: 'Failed to load messages' });
        }
      },
    );

    // ── Disconnect ───────────────────────────────────────
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${name} (${userId})`);

      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        // Only broadcast offline if no remaining connections (multi-device)
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          socket.broadcast.emit('user_offline', { userId });
        }
      }
    });
  });

  return io;
}

/** Check if a user is currently online */
export function isUserOnline(userId: string): boolean {
  return onlineUsers.has(userId) && onlineUsers.get(userId)!.size > 0;
}
