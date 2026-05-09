import { useState, useEffect } from "react";
import { historyAPI } from "../services/api";
import { Clock, ExternalLink, Search, AlertCircle } from "lucide-react";

const HistoryCard = ({ item }) => (
  <div className="card-hover bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col animate-fade-in-up">
    {/* Image */}
    <div className="relative h-48 bg-gray-100 overflow-hidden">
      <img
        src={item.imageUrl}
        alt={item.label}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        onError={(e) => { e.target.style.display = "none"; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Confidence badge */}
      <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm border
        ${item.confidence >= 80 ? "bg-green-500/80 text-white border-green-400/50" :
          item.confidence >= 50 ? "bg-amber-500/80 text-white border-amber-400/50" :
                                   "bg-red-500/80 text-white border-red-400/50"}`}>
        {item.confidence}%
      </span>

      {/* Label overlay */}
      <div className="absolute bottom-3 left-3 right-3">
        <h3 className="text-white font-bold text-lg capitalize leading-tight drop-shadow">
          {item.vietnameseName || item.label}
        </h3>
        {item.vietnameseName && (
          <p className="text-white/70 text-xs italic mt-0.5">{item.label}</p>
        )}
      </div>
    </div>

    {/* Content */}
    <div className="p-5 flex flex-col flex-1">
      <p className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
        {new Date(item.createdAt).toLocaleString("vi-VN")}
      </p>

      {item.wikipedia?.extract ? (
        <>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1 mb-4">
            {item.wikipedia.extract}
          </p>
          {item.wikipedia.pageUrl && (
            <a
              href={item.wikipedia.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-semibold group mt-auto"
            >
              <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Xem trên Wikipedia
            </a>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-400 italic flex-1">Không có thông tin từ Wikipedia.</p>
      )}
    </div>
  </div>
);

const History = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await historyAPI.getHistory();
      setHistories(res.data.data);
    } catch (error) {
      console.error("Lỗi lấy lịch sử:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = histories.filter((item) =>
    [item.label, item.vietnameseName]
      .filter(Boolean)
      .some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Đang tải lịch sử...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 40%, #f8fafc 100%)" }}>
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-4 border border-green-200">
            <Clock className="w-4 h-4" />
            Nhật ký khám phá
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
            Lịch sử <span className="text-green-600">nhận diện</span>
          </h1>
          <p className="text-gray-500 text-base">
            {histories.length > 0
              ? `Bạn đã khám phá ${histories.length} loài động vật.`
              : "Chưa có lịch sử nhận diện nào."}
          </p>
        </div>

        {/* ── Search ── */}
        {histories.length > 0 && (
          <div className="relative mb-8 animate-fade-in-up delay-100">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm loài..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition shadow-sm"
            />
          </div>
        )}

        {/* ── Empty state ── */}
        {histories.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center animate-fade-in">
            <div className="text-6xl mb-4">🔭</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Chưa có lịch sử</h3>
            <p className="text-gray-400 text-sm mb-6">
              Hãy thử nhận diện một loài động vật đầu tiên nhé!
            </p>
            <a
              href="/identify"
              className="inline-flex items-center gap-2 btn-shimmer text-white font-bold px-6 py-3 rounded-xl text-sm"
            >
              Nhận diện ngay
            </a>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center animate-fade-in">
            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Không tìm thấy kết quả cho &ldquo;{search}&rdquo;</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <HistoryCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
