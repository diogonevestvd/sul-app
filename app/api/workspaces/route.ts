import { prisma } from '@/lib/prisma';
import { badRequest, ok } from '@/lib/http';
import { getWorkspaceList, getWorkspaceRecord } from '@/lib/data';
import { getUser } from '@/lib/get-user';

export async function GET() {
  try {
    const user = await getUser();
    const workspaces = await getWorkspaceList(user.id);
    return ok({ workspaces });
  } catch (error) {
    console.error('WORKSPACES GET ERROR:', error);
    return badRequest('Could not load workspaces', 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const locale = body.locale === 'en' || body.locale === 'pt' ? body.locale : 'pt';
    const user = await getUser(locale);

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const objective = typeof body.objective === 'string' && body.objective.trim() ? body.objective.trim() : null;

    if (!title) {
      return badRequest('Title is required', 400);
    }

    const created = await prisma.workspace.create({
      data: {
        userId: user.id,
        title,
        objective,
        summary: null,
        locale
      }
    });

    const workspace = await getWorkspaceRecord(created.id, user.id);
    if (!workspace) {
      return badRequest('Could not create workspace', 500);
    }

    return ok({ workspace });
  } catch (error) {
    console.error('WORKSPACES POST ERROR:', error);
    return badRequest('Could not create workspace', 500);
  }
}
