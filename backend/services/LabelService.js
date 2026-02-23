const PDFDocument = require("pdfkit");
const qrcode = require("qrcode");

class LabelService {
  async generateLabelPdf(assets, options = { type: "single" }) {
    const isSingle = options.type === "single";

    const labelWidth = 170;
    const labelHeight = 85;
    const qrSize = 45;
    const margin = 10;

    const doc = new PDFDocument({
      size: isSingle ? [labelWidth + margin * 2, labelHeight + margin * 2] : "A4",
      margins: { top: margin, bottom: margin, left: margin, right: margin },
      layout: isSingle ? "landscape" : "portrait",
    });

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));

    return new Promise(async (resolve, reject) => {
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        console.log(`[LabelService] Generated PDF, size: ${pdfBuffer.length} bytes`);
        resolve(pdfBuffer);
      });

      doc.on("error", reject);

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

      if (isSingle && assets.length === 1) {
        const asset = assets[0];
        const qrUrl = `${frontendUrl}/inventory/assets/${asset.id}`;
        const qrBuffer = await qrcode.toBuffer(qrUrl, { margin: 1, width: qrSize * 3 });

        const x = margin;
        const y = margin;

        doc.rect(x, y, labelWidth, labelHeight).stroke("#ddd");

        const textX = x + 8;
        let textY = y + 8;

        doc.fontSize(7).font("Helvetica-Bold").fillColor("#1976d2").text("SATU DATA+", textX, textY, { continued: false });
        textY += 10;

        doc.fontSize(9).font("Helvetica-Bold").fillColor("#111").text(asset.name || "-", textX, textY, { width: labelWidth - qrSize - 25, lineBreak: false });
        textY += 10;

        doc.fontSize(7).font("Helvetica").fillColor("#333").text(`S/N: ${asset.serialNumber || "-"}`, textX, textY);
        textY += 8;

        doc.fontSize(6).fillColor("#555").text(`CAT: ${asset.category?.name || "-"}`, textX, textY);
        textY += 7;
        doc.text(`LOC: ${asset.location || "-"}`, textX, textY);

        textY = y + labelHeight - 20;
        doc.fontSize(5).fillColor("#888").text("ASSET CODE", textX, textY);
        textY += 5;
        doc.fontSize(7).font("Helvetica-Bold").fillColor("#333").text(asset.assetCode || "-", textX, textY);

        const qrX = x + labelWidth - qrSize - 8;
        const qrY = y + (labelHeight - qrSize) / 2;
        doc.image(qrBuffer, qrX, qrY, { width: qrSize });

        doc.end();
      } else {
        const cols = 3;
        const gapX = 10;
        const gapY = 10;
        const startX = margin;
        const startY = margin;

        let col = 0;
        let row = 0;

        for (const asset of assets) {
          const qrUrl = `${frontendUrl}/inventory/assets/${asset.id}`;
          const qrBuffer = await qrcode.toBuffer(qrUrl, { margin: 1, width: qrSize * 3 });

          const x = startX + col * (labelWidth + gapX);
          const y = startY + row * (labelHeight + gapY);

          doc.rect(x, y, labelWidth, labelHeight).stroke("#ddd");

          const textX = x + 6;
          let textY = y + 6;

          doc.fontSize(6).font("Helvetica-Bold").fillColor("#1976d2").text("SATU DATA+", textX, textY, { continued: false });
          textY += 8;

          doc.fontSize(8).font("Helvetica-Bold").fillColor("#111").text(asset.name || "-", textX, textY, { width: labelWidth - qrSize - 18, lineBreak: false });
          textY += 9;

          doc.fontSize(6).font("Helvetica").fillColor("#333").text(`S/N: ${asset.serialNumber || "-"}`, textX, textY);
          textY += 7;

          doc.fontSize(5).fillColor("#555").text(`CAT: ${asset.category?.name || "-"}`, textX, textY);
          textY += 6;
          doc.text(`LOC: ${asset.location || "-"}`, textX, textY);

          textY = y + labelHeight - 18;
          doc.fontSize(4).fillColor("#888").text("ASSET CODE", textX, textY);
          textY += 4;
          doc.fontSize(6).font("Helvetica-Bold").fillColor("#333").text(asset.assetCode || "-", textX, textY);

          const qrX = x + labelWidth - qrSize - 6;
          const qrY = y + (labelHeight - qrSize) / 2;
          doc.image(qrBuffer, qrX, qrY, { width: qrSize });

          col++;
          if (col >= cols) {
            col = 0;
            row++;
          }
        }

        doc.end();
      }
    });
  }
}

module.exports = new LabelService();
