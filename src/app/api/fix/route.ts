import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const recentCase = await prisma.case.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { patient: true }
    });

    if (!recentCase) {
      return NextResponse.json({ error: "Aucun Case trouvé" }, { status: 404 });
    }

    let tpCheck = await prisma.tPCheckVersion.findFirst({
      where: { caseId: recentCase.id }
    });

    if (tpCheck) {
      tpCheck = await prisma.tPCheckVersion.update({
        where: { id: tpCheck.id },
        data: {
          message: "Bonjour Docteur ! Voici le message mis à jour automatiquement ��",
          status: "PENDING",
          url: "https://pd.smileynova.com/design/?s=n2ury6ht&p=006ju475no465nu465vu46"
        }
      });
      return NextResponse.json({ success: true, message: "TP Check mis à jour", data: tpCheck });
    } else {
      tpCheck = await prisma.tPCheckVersion.create({
        data: {
          caseId: recentCase.id,
          version: 1,
          status: "PENDING",
          message: "Bonjour Docteur ! Voici le message créé automatiquement 🎉",
          url: "https://pd.smileynova.com/design/?s=n2ury6ht&p=006ju475no465nu465vu46"
        }
      });
      return NextResponse.json({ success: true, message: "TP Check créé", data: tpCheck });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
