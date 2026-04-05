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
    const objective =
      typeof body.objective === 'string' && body.objective.trim()
        ? body.objective.trim()
        : null;

    if (!title) {
      return badRequest('Title is required', 400);
    }

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        locale: user.locale
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHash: 'local-user-no-password',
        locale: user.locale
      }
    });

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (!dbUser) {
      return badRequest('Could not create local user', 500);
    }

    const created = await prisma.workspace.create({
      data: {
        userId: dbUser.id,
        title,
        objective,
        summary: null,
        locale
      }
    });

    const workspace = await getWorkspaceRecord(created.id, dbUser.id);
    if (!workspace) {
      return badRequest('Could not create workspace', 500);
    }

    return ok({ workspace });
  } catch (error) {
    console.error('WORKSPACES POST ERROR:', error);
    return badRequest('Could not create workspace', 500);
  }
}