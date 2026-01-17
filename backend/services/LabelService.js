const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const qrcode = require("qrcode");

class LabelService {
  /**
   * Generates a PDF buffer for the given assets
   * @param {Array} assets List of asset objects
   * @param {Object} options Configuration options ({ type: 'single' | 'bulk' })
   * @returns {Promise<Buffer>} PDF buffer
   */
  async generateLabelPdf(assets, options = { type: "single" }) {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome",
    });

    try {
      const page = await browser.newPage();

      // Generate QR codes for all assets
      const assetsWithQr = await Promise.all(
        assets.map(async (asset) => {
          const qrUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/inventory/assets/${asset.id}`;
          const qrDataUrl = await qrcode.toDataURL(qrUrl, {
            margin: 1,
            width: 100,
          });
          return { ...asset, qrDataUrl };
        }),
      );

      const html = this.generateHtml(assetsWithQr, options);
      await page.setContent(html, { waitUntil: "networkidle0" });

      // PDF options
      const pdfOptions = {
        printBackground: true,
      };

      if (options.type === "single") {
        pdfOptions.width = "7cm";
        pdfOptions.height = "3.5cm";
        pdfOptions.pageRanges = "1";
      } else {
        pdfOptions.format = "A4";
        pdfOptions.margin = {
          top: "1cm",
          right: "1cm",
          bottom: "1cm",
          left: "1cm",
        };
      }

      const pdfBuffer = await page.pdf(pdfOptions);
      console.log(
        `[LabelService] Generated PDF, size: ${pdfBuffer.length} bytes`,
      );
      return pdfBuffer;
    } finally {
      await browser.close();
    }
  }

  generateHtml(assets, options) {
    const isSingle = options.type === "single";

    // CSS Styles
    const css = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        background: white;
      }

      .page {
        width: 100%;
        height: 100%;
        ${
          !isSingle
            ? `
          display: grid;
          grid-template-columns: repeat(3, 6cm);
          gap: 0.4cm;
          justify-content: center;
        `
            : ""
        }
      }

      .label {
        width: 6cm;
        height: 3cm;
        border: 1px solid #ddd;
        padding: 0.1cm;
        display: flex;
        position: relative;
        background: white;
        overflow: hidden;
      }

      .label-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0.2cm;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 2px;
      }

      .logo-text {
        font-size: 7px;
        font-weight: 700;
        color: #1976d2;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .asset-name {
        font-size: 9px;
        font-weight: 700;
        color: #111;
        line-height: 1.2;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 1px;
      }

      .serial-number {
        font-family: monospace;
        font-size: 8px;
        font-weight: 600;
        color: #333;
        margin-bottom: 1px;
      }

      .meta-row {
        font-size: 7px;
        color: #555;
        margin-bottom: 1px;
      }
      
      .meta-label {
        color: #888;
        font-size: 6px;
      }

      .footer {
        margin-top: auto;
      }

      .barcode-text {
        font-family: monospace;
        font-size: 8px;
        font-weight: 600;
        letter-spacing: 0.5px;
        color: #333;
      }

      .qr-container {
        width: 2cm;
        height: 2cm;
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: center;
      }

      .qr-code {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    `;

    const renderLabel = (asset) => `
      <div class="label">
        <div class="label-content">
          <div>
            <div class="header">
              <span class="logo-text">Satu Data+</span>
            </div>
            <div class="asset-name">${asset.name}</div>
            <div class="serial-number">S/N: ${asset.serialNumber || "-"}</div>
            <div class="meta-row">
              <span class="meta-label">CAT</span> ${asset.category?.name || "-"}
            </div>
            <div class="meta-row">
              <span class="meta-label">LOC</span> ${asset.location || "-"}
            </div>
          </div>
          <div class="footer">
            <div class="meta-label">ASSET CODE</div>
            <div class="barcode-text">${asset.assetCode}</div>
          </div>
        </div>
        <div class="qr-container">
          <img src="${asset.qrDataUrl}" class="qr-code" />
        </div>
      </div>
    `;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          <div class="page">
            ${assets.map(renderLabel).join("")}
          </div>
        </body>
      </html>
    `;
  }
}

module.exports = new LabelService();
