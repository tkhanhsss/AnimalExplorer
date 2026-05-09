import History from "../models/History.js";

// GET /api/history - Lấy lịch sử nhận diện của user
export const getHistory = async (req, res) => {
  try {
    const history = await History.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: history });
  } catch (error) {
    console.error("History error:", error.message);
    res.status(500).json({ success: false, message: "Lỗi lấy lịch sử" });
  }
};
