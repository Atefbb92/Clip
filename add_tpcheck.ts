import { prisma } from './src/lib/prisma'

async function main() {
    // --- REMPLISSEZ CES VALEURS ---
    const caseId = "cmmcrg1kx0001h7onlkq2w6mm"; // Remplacez par le vrai caseId
    const tpCheckUrl = "https://pd.smileynova.com/design/?s=xafxv2ut&p=0349kwyxdewzxdkwyxlkwycom";
    const tpCheckMessage = "Message optionnel";
    const version = 1;
    const pack = "Lite";
    const stepsUpper = 15;
    const stepsLower = 10;
    const rhythm = "7";
    const quoteHT = 1000;
    const discount = 20;
    // ------------------------------

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Créer le TP Check
            const tpCheck = await tx.tPCheckVersion.create({
                data: {
                    caseId: caseId,
                    version: version,
                    url: tpCheckUrl,
                    message: tpCheckMessage,
                    status: 'PENDING',
                    pack: pack,
                    stepsUpper: stepsUpper,
                    stepsLower: stepsLower,
                    rhythm: rhythm,
                    quoteHT: quoteHT,
                    discount: discount
                },
            });

            // 2. Mettre à jour le statut du Cas (TRÈS IMPORTANT pour l'affichage)
            await tx.case.update({
                where: { id: caseId },
                data: { globalStatus: 'EN_ATTENTE_DE_VALIDATION' },
            });

            // 3. Ajouter l'événement dans l'historique
            await tx.treatmentEvent.create({
                data: {
                    caseId: caseId,
                    type: 'TP_CHECK_ADDED',
                    description: `TP Check v${version} ajouté`,
                    actor: 'DIAMONDSUITE',
                },
            });

            return tpCheck;
        });

        console.log("Succès ! TP Check ajouté et statut mis à jour :");
        console.log(result);
    } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
    } finally {
        await prisma.$disconnect().catch(() => { });
    }
}

main();
