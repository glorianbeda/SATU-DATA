const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("@/middleware/auth");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const { requestId } = req.body;
    const signerId = req.user.id;

    if (!requestId) {
      return res.status(400).json({ error: "Request ID is required" });
    }

    const request = await prisma.signatureRequest.findUnique({
      where: { id: parseInt(requestId) },
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.signerId !== signerId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (request.status !== "PENDING") {
      return res.status(400).json({ error: "Request already processed" });
    }

    // Update request status
    const updatedRequest = await prisma.signatureRequest.update({
      where: { id: parseInt(requestId) },
      data: {
        status: "REJECTED",
        isSigned: false,
        rejectedAt: new Date(),
      },
    });

    res.json({
      message: "Request rejected",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Reject request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = [authMiddleware, handler];
