import axios from "axios";
import FormData from "form-data";
import jwt from "jsonwebtoken";
import cloudinary from "../configs/cloudinary.js";
import History from "../models/History.js";

// POST /api/identify  — nhận file ảnh, gọi AI service, trả kết quả + thông tin Wikipedia
export const identifySpecies = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng upload ảnh" });
    }

    // ── Bước 1: Gọi AI service (FastAPI) ──────────────────────────────
    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const aiResponse = await axios.post(
      process.env.AI_SERVICE_URL, // ví dụ: http://localhost:8000/predict
      formData,
      { headers: formData.getHeaders() },
    );

    // Lấy nhãn dự đoán từ AI service
    const label = aiResponse.data.class || aiResponse.data.label;
    // Lấy tên tiếng Việt từ phản hồi của AI
    const vietnameseName =
      aiResponse.data.class_vi ||
      aiResponse.data.vietnamese_name ||
      aiResponse.data.vietnameseName ||
      aiResponse.data.name_vi ||
      aiResponse.data.vietnamese ||
      "";
    const confidence = aiResponse.data.confidence;

    // ── Bước 2: Tìm thông tin trên Wikipedia ──────────────────────────
    const searchKeyword = vietnameseName || label;
    let wikiData = null;

    try {
      // Wikipedia API yêu cầu Header User-Agent để không bị chặn (Lỗi 403)
      const wikiHeaders = { headers: { "User-Agent": "AnimalExplorer/1.0" } };
      
      // 1. Tìm kiếm trên Wikipedia tiếng Việt để lấy đúng tiêu đề bài viết
      const searchUrl = `https://vi.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchKeyword)}&utf8=&format=json`;
      const searchRes = await axios.get(searchUrl, wikiHeaders);
      
      if (searchRes.data.query && searchRes.data.query.search.length > 0) {
        // 2. Lấy thông tin chi tiết bằng REST API với tiêu đề chính xác nhất
        const bestMatchTitle = searchRes.data.query.search[0].title;
        const wikiSummaryUrl = `https://vi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestMatchTitle)}`;
        const wikiRes = await axios.get(wikiSummaryUrl, wikiHeaders);
        
        wikiData = {
          title: wikiRes.data.title,
          extract: wikiRes.data.extract,
          thumbnail: wikiRes.data.thumbnail?.source || null,
          pageUrl: wikiRes.data.content_urls?.desktop?.page || null,
        };
      }
    } catch (err) {
      console.error("Wikipedia search error:", err.message);
      // Wikipedia không tìm thấy thì bỏ qua
    }

    // ── Bước 3: Lưu lịch sử nếu đã đăng nhập ──────────────────────────
    let userId = null;
    if (req.cookies?.token) {
      try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (e) {}
    }

    if (userId) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "history" },
        async (err, result) => {
          if (!err && result) {
            await History.create({
              userId,
              label,
              confidence: Math.round(confidence * 100),
              imageUrl: result.secure_url,
              wikipedia: wikiData,
            });

            // ── Giới hạn lịch sử để chống spam & tràn bộ nhớ ──
            const MAX_HISTORY = 20;
            const userHistories = await History.find({ userId }).sort({ createdAt: -1 });
            
            if (userHistories.length > MAX_HISTORY) {
              const oldHistories = userHistories.slice(MAX_HISTORY);
              for (const old of oldHistories) {
                // 1. Xóa ảnh cũ trên Cloudinary để tiết kiệm dung lượng
                if (old.imageUrl) {
                  try {
                    const urlParts = old.imageUrl.split('/');
                    const filename = urlParts[urlParts.length - 1].split('.')[0];
                    const folder = urlParts[urlParts.length - 2];
                    const publicId = `${folder}/${filename}`;
                    await cloudinary.uploader.destroy(publicId);
                  } catch (e) {
                    console.error("Lỗi xóa ảnh cũ:", e);
                  }
                }
                // 2. Xóa bản ghi cũ khỏi DB
                await History.findByIdAndDelete(old._id);
              }
            }
          }
        },
      );
      uploadStream.end(req.file.buffer);
    }

    res.json({
      success: true,
      result: {
        label,
        vietnameseName,
        confidence: Math.round(confidence * 100),
        wikipedia: wikiData,
      },
    });
  } catch (error) {
    console.error("Identify error:", error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi nhận diện. Thử lại sau.",
      error: error.message,
      stack: error.stack,
    });
  }
};
