import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { badRequest, ok } from '@/lib/http';
import { getWorkspaceRecord } from '@/lib/data';
import { getUser } from '@/lib/get-user';

const schema = z.object({
  kind: z.enum(['ideas', 'blockers', 'resources', 'note']),
  content: z.string().min(1)
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    const { id } = await context.params;

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return badRequest('Invalid entry');

    const workspace = await prisma.workspace.findFirst({
      where: { id, userId: user.id }
    });

    if (!workspace) return badRequest('Not found', 404);

    if (parsed.data.kind === 'note') {
      await prisma.preferenceNote.create({
        data: {
          workspaceId: workspace.id,
          content: parsed.data.content
        }
      });
    } else {
      await prisma.entry.create({
        data: {
          workspaceId: workspace.id,
          kind: parsed.data.kind,
          content: parsed.data.content
        }
      });
    }

    const full = await getWorkspaceRecord(workspace.id, user.id);
    return ok({ workspace: full });
  } catch (error) {
    console.error('ENTRY POST ERROR:', error);
    return badRequest('Could not create entry', 500);
  }
}
