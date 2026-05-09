import { useState } from "react";
import { identifyAPI } from "../services/api";
import UploadBox from "../components/UploadBox";
import { Sparkles, ExternalLink, AlertCircle, CheckCircle2, Info } from "lucide-react";

const ConfidenceBadge = ({ value }) => {
  const color =
    value >= 80 ? "bg-green-100 text-green-700 border-green-200" :
    value >= 50 ? "bg-amber-100 text-amber-700 border-amber-200" :
                  "bg-red-100 text-red-700 border-red-200";
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${color}`}>
      {value}% chính xác
    </span>
  );
};

const Identify = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setResult(null);
    setError("");
  };

  const handleIdentify = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await identifyAPI.identify(formData);
      setResult(res.data.result);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể nhận diện. Thử lại với ảnh khác.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 40%, #f8fafc 100%)" }}>
      <div className="max-w-2xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-5 border border-green-200">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            Nhận diện bằng AI
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
            Nhận Diện <span className="text-green-600">Loài Vật</span>
          </h1>
          <p className="text-gray-500 text-base max-w-sm mx-auto leading-relaxed">
            Tải lên ảnh động vật — AI sẽ nhận diện và trả về thông tin sinh học chi tiết ngay lập tức.
          </p>
        </div>

        {/* ── Upload card ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-4 animate-fade-in-up delay-100">
          <UploadBox onFileSelect={handleFileSelect} disabled={loading} />
        </div>

        {/* ── Identify button ── */}
        <button
          onClick={handleIdentify}
          disabled={!file || loading}
          className={`animate-fade-in-up delay-200 w-full py-4 font-bold text-base rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-200
            ${!file || loading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "btn-shimmer text-white shadow-lg"
            }`}
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin-slow" />
              Đang phân tích...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Nhận diện ngay
            </>
          )}
        </button>

        {/* ── Tips ── */}
        {!file && !result && (
          <div className="mt-4 flex items-start gap-2 text-xs text-gray-400 px-1 animate-fade-in delay-300">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>Để đạt kết quả tốt nhất, hãy dùng ảnh chụp rõ nét, ánh sáng tốt và loài vật chiếm phần lớn khung hình.</p>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="mt-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-2xl animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* ── Result ── */}
        {result && (
          <div className="mt-6 bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden animate-fade-in-up">

            {/* Result header */}
            <div className="relative bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 text-white p-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-300" />
                  <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Kết quả nhận diện</p>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold capitalize leading-tight mb-3">
                  {result.vietnameseName
                    ? <>{result.vietnameseName} <span className="text-green-200 text-lg font-semibold">— {result.label}</span></>
                    : result.label}
                </h2>

                {/* Confidence bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white/20 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${result.confidence}%`,
                        background: result.confidence >= 80 ? "#4ade80" : result.confidence >= 50 ? "#fbbf24" : "#f87171",
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold bg-white/20 rounded-full px-3 py-0.5 whitespace-nowrap">{result.confidence}%</span>
                </div>
                <p className="text-xs opacity-60 mt-1.5">Độ chính xác</p>
              </div>
            </div>

            {/* Wikipedia info */}
            {result.wikipedia ? (
              <div className="p-6">
                <div className="flex gap-4">
                  {result.wikipedia.thumbnail && (
                    <img
                      src={result.wikipedia.thumbnail}
                      alt={result.wikipedia.title}
                      className="w-28 h-28 object-cover rounded-2xl flex-shrink-0 shadow-sm ring-1 ring-gray-100"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                      <h3 className="font-bold text-gray-800 text-lg leading-tight">{result.wikipedia.title}</h3>
                      <ConfidenceBadge value={result.confidence} />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{result.wikipedia.extract}</p>
                  </div>
                </div>

                {result.wikipedia.pageUrl && (
                  <a
                    href={result.wikipedia.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-400 hover:text-green-700 py-3 rounded-2xl transition-all text-sm font-semibold group"
                  >
                    <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Xem đầy đủ trên Wikipedia
                  </a>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                <p className="text-2xl mb-2">🔍</p>
                <p>Không tìm thấy thông tin trên Wikipedia.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Identify;
