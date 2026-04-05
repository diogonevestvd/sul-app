import { prisma } from '@/lib/prisma';

const LOCAL_USER_ID = 'local-user';

export async function getUser(locale: 'pt' | 'en' = 'pt') {
  const user = await prisma.user.upsert({
    where: { id: LOCAL_USER_ID },
    update: { locale },
    create: {
      id: LOCAL_USER_ID,
      name: 'Local User',
      email: 'local@device.sul',
      passwordHash: 'local-only',
      locale
    }
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    locale: (user.locale === 'en' ? 'en' : 'pt') as 'pt' | 'en'
  };
}
