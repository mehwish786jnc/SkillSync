import { Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth';
import { isUserOnline } from '../socket/chat';

/**
 * GET /api/chat/rooms
 * List all chat rooms the authenticated user belongs to,
 * with the last message and peer info.
 */
export async function getRooms(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;

    const memberships = await prisma.chatRoomMember.findMany({
      where: { userId },
      include: {
        room: {
          include: {
            members: {
              include: {
                user: { select: { id: true, name: true, avatar: true } },
              },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: {
                sender: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });

    // Shape the response: extract peer info, last message, online status
    const rooms = memberships
      .map(({ room }) => {
        const peer = room.members.find((m) => m.userId !== userId)?.user;
        const lastMessage = room.messages[0] || null;
        return {
          id: room.id,
          peer: peer ? { ...peer, online: isUserOnline(peer.id) } : null,
          lastMessage,
          updatedAt: room.updatedAt,
        };
      })
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    res.json({ status: 'success', data: { rooms } });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/chat/rooms/:roomId/messages?before=<ISO>&limit=50
 * Paginated message history for a specific room.
 */
export async function getMessages(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { roomId } = req.params;
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const before = req.query.before as string | undefined;

    // Verify membership
    const member = await prisma.chatRoomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!member) throw new AppError('Not a member of this room', 403);

    const messages = await prisma.message.findMany({
      where: {
        roomId,
        ...(before && { createdAt: { lt: new Date(before) } }),
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Return in chronological order
    res.json({
      status: 'success',
      data: { messages: messages.reverse(), hasMore: messages.length === limit },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/chat/online
 * Return online status for a list of user IDs.
 * Query: ?userIds=id1,id2,id3
 */
export async function getOnlineStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const raw = req.query.userIds as string;
    if (!raw) throw new AppError('userIds query parameter is required', 400);

    const userIds = raw.split(',').filter(Boolean).slice(0, 100); // Cap at 100
    const statuses: Record<string, boolean> = {};
    for (const id of userIds) {
      statuses[id] = isUserOnline(id);
    }

    res.json({ status: 'success', data: { statuses } });
  } catch (err) {
    next(err);
  }
}
