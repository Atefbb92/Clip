import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("=== Début de la réparation automatique ===");

  // 1. Trouver le Case le plus récent
  const recentCase = await prisma.case.findFirst({
    orderBy: { createdAt: 'desc' },
    include: { patient: true }
  });

  if (!recentCase) {
    console.log("❌ Aucun Case (Dossier Patient) trouvé dans la base !");
    return;
  }
  console.log(`✅ Case récent trouvé (ID: ${recentCase.id}) pour le patient ${recentCase.patient?.name || 'Inconnu'}`);

  // 2. Vérifier s'il y a déjà un TPCheckVersion pour ce Case
  let tpCheck = await prisma.tPCheckVersion.findFirst({
    where: { caseId: recentCase.id }
  });

  if (tpCheck) {
    console.log(`✅ Un TP Check existe déjà pour ce Case (ID: ${tpCheck.id})`);

    // Mettre à jour le message
    tpCheck = await prisma.tPCheckVersion.update({
      where: { id: tpCheck.id },
      data: {
        message: "Bonjour Docteur ! Voici le message du TP Check mis à jour automatiquement 🎉",
        status: "PENDING",
        url: "https://pd.smileynova.com/design/?s=n2ury6ht&p=006ju475no465nu465vu46"
      }
    });
    console.log(`✅ Message mis à jour avec succès dans le TP Check !`);

  } else {
    console.log(`⚠️ Aucun TP Check pour ce Case. Création d'un nouveau...`);

    tpCheck = await prisma.tPCheckVersion.create({
      data: {
        caseId: recentCase.id,
        version: 1,
        status: "PENDING",
        message: "Bonjour Docteur ! Voici le tout premier message du TP Check créé automatiquement 🎉",
        url: "https://pd.smileynova.com/design/?s=n2ury6ht&p=006ju475no465nu465vu46"
      }
    });
    console.log(`✅ Nouveau TP Check créé (ID: ${tpCheck.id})`);
  }

  console.log("\n✅ === RÉPARATION TERMINÉE ! ===");
  console.log("👉 Allez sur Clip, actualisez la page de ce patient, et le message s'affichera !");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
