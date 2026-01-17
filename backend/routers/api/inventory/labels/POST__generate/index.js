const LabelService = require("@/services/LabelService");

module.exports = async (req, res) => {
  try {
    const { assets, config } = req.body;

    if (!assets || !Array.isArray(assets) || assets.length === 0) {
      return res
        .status(400)
        .json({ error: "Assets list is required and cannot be empty" });
    }

    const pdfBuffer = await LabelService.generateLabelPdf(assets, config);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="labels-${Date.now()}.pdf"`,
      "Content-Length": pdfBuffer.length,
    });

    res.end(pdfBuffer);
  } catch (error) {
    console.error("Error generating labels:", error);
    res.status(500).json({ error: "Failed to generate labels" });
  }
};
