import 'dotenv/config';
import { prisma } from './src/lib/prisma';

async function main() {
    // --- REMPLISSEZ CES VALEURS ---

    // Utilisez l'ID du Patient (depuis l'URL) ou directement le caseId
    const patientId = "cmmcrg1kx0001h7onlkq2w6mm";

    // Le numéro de la version que vous ajoutez (ex: 2 pour la deuxième version, 3 pour la troisième)
    const versionNumber = 3;

    const tpCheckUrl = "https://pd.smileynova.com/design/?s=xafxv2ut&p=0349kwyxdewzxdkwyxlkwycom"; // Mettez le bon lien ici
    const tpCheckMessage = "Voici la version " + versionNumber + " du traitement, suite à vos remarques.";

    const pack = "Full"; // "Lite", "Full", etc...
    const stepsUpper = 20;
    const stepsLower = 20;
    const rhythm = "10";
    const quoteHT = 2000;
    const discount = 10;
    // ------------------------------

    try {
        const inputId = patientId;
        let caseId = "";

        // Verifier si c'est un caseId
        const maybeCase = await prisma.case.findUnique({
            where: { id: inputId }
        });

        if (maybeCase) {
            caseId = maybeCase.id;
        } else {
            // Sinon on suppose que c'est un patientId
            const patientCase = await prisma.case.findFirst({
                where: { patientId: inputId },
                orderBy: { createdAt: 'desc' },
            });

            if (!patientCase) {
                console.error("❌ Erreur : L'ID fourni ne correspond ni à un Patient valide, ni à un Cas.");
                return;
            }
            caseId = patientCase.id;
        }

        const result = await prisma.$transaction(async (tx) => {
            // 1. Créer le NOUVEAU TP Check
            const tpCheck = await tx.tPCheckVersion.create({
                data: {
                    caseId: caseId,
                    version: versionNumber,
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

            // 2. Mettre à jour le statut du Cas Global à "En attente de validation"
            await tx.case.update({
                where: { id: caseId },
                data: { globalStatus: 'EN_ATTENTE_DE_VALIDATION' },
            });

            // 3. Ajouter l'événement dans l'historique
            await tx.treatmentEvent.create({
                data: {
                    caseId: caseId,
                    type: 'TP_CHECK_ADDED',
                    description: `TP Check v${versionNumber} ajouté`,
                    actor: 'DIAMONDSUITE',
                },
            });

            // 4. (Optionnel) Ajouter un message automatique du laboratoire pour prévenir le docteur
            if (tpCheckMessage) {
                await tx.tPCheckMessage.create({
                    data: {
                        caseId: caseId,
                        sender: 'DIAMONDSUITE',
                        text: `Nouvelle version du plan de traitement (v${versionNumber}) soumise : ${tpCheckMessage}`
                    }
                });
            }

            return tpCheck;
        });

        console.log(`✅ Succès ! TP Check version ${versionNumber} ajouté avec succès :`);
        console.log(result);
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout :", error);
    } finally {
        await prisma.$disconnect().catch(() => { });
    }
}

main();
