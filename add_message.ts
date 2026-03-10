import 'dotenv/config';
import { prisma } from './src/lib/prisma'

async function main() {
    // --- REMPLISSEZ CES VALEURS ---

    // Vous pouvez utiliser le patientId (celui dans l'URL /patients/...) 
    // ou le caseId directement.
    const patientId = "cmmcrg1kx0001h7onlkq2w6mm";

    const messageTexte = "Bje vais tester maintenant avec le script";

    // --- NE MODIFIEZ PAS LA SUITE ---

    try {
        const inputId = patientId; // This is whatever the user pasted
        let caseId = "";

        // First, let's see if the user pasted a Case ID directly
        const maybeCase = await prisma.case.findUnique({
            where: { id: inputId }
        });

        if (maybeCase) {
            caseId = maybeCase.id;
        } else {
            // It wasn't a Case ID, let's assume it's a Patient ID (from the URL)
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

        // Ajouter le message en tant que DIAMONDSUITE
        const result = await prisma.tPCheckMessage.create({
            data: {
                caseId: caseId,
                text: messageTexte,
                sender: 'DIAMONDSUITE', // ou 'MEDECIN'
            },
        });

        console.log("✅ Succès ! Message ajouté à la discussion avec succès :");
        console.log(result);
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout :", error);
    } finally {
        await prisma.$disconnect().catch(() => { });
    }
}

main();
