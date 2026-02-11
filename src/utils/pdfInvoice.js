import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/img/GrinGenius.png'

// Helper to convert image URL to base64
async function getBase64FromUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export async function generateInvoicePDF(patient, medecin, logoBase64, invoiceNumber = "INV-00001") {
  const doc = new jsPDF();

  // Calculate prices
  const originalPrice =
    typeof patient.price === 'number'
      ? patient.price
      : (typeof patient.basePrice === 'number'
        ? patient.basePrice
        : (typeof patient.baseprice === 'number'
          ? patient.baseprice
          : 0));
  const discountPercent = patient.discount || 0;
  const discountAmount = (originalPrice * discountPercent) / 100;
  const sousTotal = originalPrice - discountAmount;
  const tva = sousTotal * 0.19;
  const timbre = 1.000;
  const total = sousTotal + tva + timbre;

  // Calculate due date (factureDate + 15 days)
  const factureDate = patient.factureDate ? new Date(patient.factureDate) : new Date();
  const dueDate = new Date(factureDate);
  dueDate.setDate(dueDate.getDate() + 15);

  // Add logo (top left corner) before company info
  let logoToUse = logoBase64;
  if (!logoToUse && logo) {
    // If logoBase64 not provided, use imported logo (URL)
    try {
      logoToUse = await getBase64FromUrl(logo);
    } catch (e) {
      console.warn('Could not convert logo to base64:', e);
    }
  }
  if (logoToUse) {
    try {
      const base64Data = logoToUse.includes('data:image') ? logoToUse : `data:image/png;base64,${logoToUse}`;
      doc.addImage(base64Data, 'PNG', 10, 10, 30, 30);
    } catch (e) {
      console.warn('Could not add logo:', e);
    }
  }

  // Company info (left, below logo)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('GrinGenius', 45, 18);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('B11, Av. Habib Bourguiba - Cité Elghazella L\'Ariana 2083 -', 45, 23);
  doc.text('Tunisie', 45, 27);
  doc.text('customer@grin-genius.com', 45, 31);
  doc.text('Matricule Fiscal: 1808266/N/A/M/000', 45, 35);
  doc.text('IBAN: TN59 1060 8006 1064 3737 8870', 45, 39);

  // Move invoice header (right) further up
  const headerStartY = 25;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Facture', 200, headerStartY, { align: 'right' });
  doc.setFontSize(10);
  doc.setTextColor(0, 182, 201); // blue
  doc.text('Solde dû', 200, headerStartY + 18, { align: 'right' });
  doc.setFontSize(16);
  doc.text(`TND${total.toFixed(3)}`, 200, headerStartY + 26, { align: 'right' });
  doc.setTextColor(0, 0, 0);

  // Patient/Doctor details (left, below company info)
  let leftDetailsY = 60;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`${medecin.name || 'Nom du médecin'}`, 10, leftDetailsY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  let yPos = leftDetailsY + 5;
  if (medecin.address) { doc.setTextColor(0, 182, 201); doc.text(medecin.address, 10, yPos); yPos += 4; }
  if (medecin.city) { doc.text(medecin.city, 10, yPos); yPos += 4; }
  if (medecin.postalCode && medecin.city) { doc.text(`${medecin.postalCode} ${medecin.city}`, 10, yPos); yPos += 4; }
  if (medecin.country) { doc.text(medecin.country, 10, yPos); yPos += 4; }
  doc.setTextColor(0, 0, 0);

  // Dates & conditions (right, below header)
  let rightDetailsY = headerStartY + 38;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  // Date de facture
  let labelX = 140;
  let valueX = labelX + 35;
  doc.setTextColor(0, 0, 0);
  doc.text('Date de facture :', labelX, rightDetailsY);
  doc.setTextColor(0, 182, 201);
  doc.text(factureDate.toLocaleDateString('fr-FR'), valueX, rightDetailsY);
  rightDetailsY += 6;
  // Conditions
  doc.setTextColor(0, 0, 0);
  doc.text('Conditions :', labelX, rightDetailsY);
  doc.setTextColor(0, 182, 201);
  doc.text('Payable à réception', valueX, rightDetailsY);
  rightDetailsY += 6;
  // Date d'échéance
  doc.setTextColor(0, 0, 0);
  doc.text('Date d\'échéance :', labelX, rightDetailsY);
  doc.setTextColor(0, 182, 201);
  doc.text(dueDate.toLocaleDateString('fr-FR'), valueX, rightDetailsY);
  doc.setTextColor(0, 0, 0);

  // Items table
  const tableStartY = Math.max(yPos + 10, rightDetailsY + 10, 90);
  autoTable(doc, {
    startY: tableStartY,
    head: [['#', 'Description', 'Quantité', 'Taux', 'Remise', 'Montant']],
    body: [
      [
        '1',
        `Diamond® Aligner - ${patient.pack || 'Pack Smart double jaw'}\n${patient.name} ${patient.surname}`,
        '1.00',
        `${originalPrice.toFixed(3)}`,
        `${discountPercent.toFixed(2)}%`,
        `${sousTotal.toFixed(3)}`
      ]
    ],
    theme: 'grid',
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 8, cellPadding: 3 },
    styles: { fontSize: 8, cellPadding: 3, lineColor: [128, 128, 128], lineWidth: 0.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 90 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 20, halign: 'center' },
      5: { cellWidth: 25, halign: 'right' }
    }
  });

  // Calculation summary after the table
  let summaryY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('Sous-total', 140, summaryY);
  doc.text(`${sousTotal.toFixed(3)}`, 200, summaryY, { align: 'right' });
  summaryY += 5;
  doc.text('TVA (19%)', 140, summaryY);
  doc.text(`${tva.toFixed(3)}`, 200, summaryY, { align: 'right' });
  summaryY += 5;
  doc.text('Timbre', 140, summaryY);
  doc.text(`${timbre.toFixed(3)}`, 200, summaryY, { align: 'right' });
  summaryY += 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 182, 201); // blue
  doc.text('Total', 140, summaryY);
  doc.text(`TND${total.toFixed(3)}`, 200, summaryY, { align: 'right' });
  summaryY += 5;
  doc.text('Solde dû', 140, summaryY);
  doc.text(`TND${total.toFixed(3)}`, 200, summaryY, { align: 'right' });
  doc.setTextColor(0, 0, 0);

  // Thank you message
  let y = summaryY + 15;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 182, 201); // blue

  doc.text('Merci pour votre achat du produit Diamond®. Veuillez effectuer le paiement dans un délai de 15 jours. Si vous avez des questions', 10, y);
  y += 4;
  doc.text('concernant la facture, n\'hésitez pas à nous contacter par téléphone au +216 55 914 761 ou par email à invoice@grin-genius.com. Nous', 10, y);
  y += 4;
  doc.text('apprécions votre confiance et espérons continuer à vous servir.', 10, y);

  // Terms and conditions
  y += 10;
  doc.setFontSize(7);

  // Term 1
  doc.setFont('helvetica', 'bold');
  doc.text('1. Conditions de paiement :', 10, y);
  doc.setFont('helvetica', 'normal');
  y += 3;
  doc.text('Le paiement doit être effectué dans un délai de 15 jours à compter de la date de facturation. Les modes de', 10, y);
  y += 3;
  doc.text('paiement acceptés sont le chèque et le virement bancaire sur le compte suivant:', 10, y);
  y += 3;
  doc.text('IBAN: TN59 1060 8006 1064 3737 8870', 10, y);
  y += 3;
  doc.text('En cas de retard de paiement, des pénalités de retard de 1 % par mois seront appliquées.', 10, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('2. Livraison :', 10, y);
  doc.setFont('helvetica', 'normal');
  y += 3;
  doc.text('Les aligneurs orthodontiques seront livrés dans un délai de 3-5 jours ouvrables après la validation de la commande. Les frais', 10, y);
  y += 3;
  doc.text('de transport ne sont pas inclus dans le prix total. Nous déclinons toute responsabilité en cas de retard de livraison dû à des circonstances', 10, y);
  y += 3;
  doc.text('indépendantes de notre volonté.', 10, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('3. Retours et remboursements :', 10, y);
  doc.setFont('helvetica', 'normal');
  y += 3;
  doc.text('En raison de la nature personnalisée des aligneurs orthodontiques, les retours ne sont pas acceptés, sauf', 10, y);
  y += 3;
  doc.text('en cas de défaut de fabrication. Si vous recevez un produit défectueux, veuillez nous contacter dans un délai de 7 jours à compter de la', 10, y);
  y += 3;
  doc.text('réception pour organiser un remplacement.', 10, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('4. Garanties :', 10, y);
  doc.setFont('helvetica', 'normal');
  y += 3;
  doc.text('Les aligneurs orthodontiques sont garantis contre les défauts de fabrication pendant une période de 6 mois à compter de la', 10, y);
  y += 3;
  doc.text('date de livraison. Cette garantie couvre uniquement le remplacement des produits défectueux.', 10, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('5. Réclamations :', 10, y);
  doc.setFont('helvetica', 'normal');
  y += 3;
  doc.text('Toute réclamation doit être signalée dans un délai de 7 jours après réception des aligneurs orthodontiques. Veuillez', 10, y);
  y += 3;
  doc.text('fournir une description détaillée du problème et des photos si nécessaire. Nous nous engageons à résoudre toute réclamation dans les', 10, y);

  // Continue on next page if needed
  if (y > 270) {
    doc.addPage();
    y = 20;
  } else {
    y += 3;
  }
  doc.text('meilleurs délais.', 10, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('6. Confidentialité :', 10, y);
  doc.setFont('helvetica', 'normal');
  y += 3;
  doc.text('Les informations personnelles fournies par le patient seront traitées de manière confidentielle et ne seront pas', 10, y);
  y += 3;
  doc.text('partagées avec des tiers sans consentement préalable, conformément à notre politique de confidentialité.', 10, y);

  // Download the PDF
  doc.save(`Facture_${patient.name}_${patient.surname}_${factureDate.toISOString().split('T')[0]}.pdf`);
} 