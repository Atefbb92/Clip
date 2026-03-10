import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const tps = await prisma.tPCheckVersion.findMany({ include: { messages: true } });
  console.log(JSON.stringify(tps, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
