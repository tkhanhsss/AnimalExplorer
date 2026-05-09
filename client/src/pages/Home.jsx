import { Link } from "react-router-dom";
import { Camera, BrainCircuit, BookOpen, ArrowRight, Leaf, Shield, Zap, Sparkles } from "lucide-react";

const STEPS = [
  {
    icon: Camera,
    title: "Chụp hình",
    desc: "Tải lên hình ảnh của loài động vật bạn bắt gặp trong tự nhiên hoặc từ thư viện ảnh.",
    color: "from-green-400 to-emerald-600",
    bg: "bg-green-50", border: "border-green-200", iconColor: "text-green-600",
  },
  {
    icon: BrainCircuit,
    title: "AI Phân tích",
    desc: "Hệ thống AI tiên tiến quét và phân tích hình ảnh, trả về tên loài với độ chính xác cao.",
    color: "from-blue-400 to-violet-600",
    bg: "bg-blue-50", border: "border-blue-200", iconColor: "text-blue-600",
  },
  {
    icon: BookOpen,
    title: "Khám phá",
    desc: "Nhận kết quả kèm thông tin sinh học phong phú được trích xuất trực tiếp từ Wikipedia.",
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50", border: "border-amber-200", iconColor: "text-amber-600",
  },
];

const STATS = [
  { value: "90+",  label: "Loài động vật",      icon: Leaf     },
  { value: "95%",  label: "Độ chính xác",        icon: Shield   },
  { value: "<3s",  label: "Thời gian phân tích", icon: Zap      },
  { value: "Free", label: "Hoàn toàn miễn phí",  icon: Sparkles },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* ── Hero gọn ────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-16 px-8">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Text */}
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Khám Phá{" "}
              <span className="text-green-600">Thế Giới Động Vật</span>
            </h1>
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              Chỉ cần tải lên một bức ảnh — AI sẽ nhận diện tức thì loài động vật
              và cung cấp toàn bộ thông tin sinh học hấp dẫn.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/identify"
                className="btn-shimmer text-white font-bold text-base px-6 py-3 rounded-xl shadow-md flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Bắt đầu nhận diện
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="text-gray-600 font-semibold text-base px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Tìm hiểu thêm
              </a>
            </div>
          </div>

          {/* Stats mini grid */}
          <div className="grid grid-cols-2 gap-4 flex-shrink-0">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-gray-800 leading-none">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────── */}
      <section id="how-it-works" className="py-20 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
              Cách thức hoạt động
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              Trải nghiệm chỉ với <span className="text-green-600">3 bước</span>
            </h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto">
              Trở thành nhà thám hiểm thiên nhiên chưa bao giờ dễ dàng đến thế.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector */}
            <div className="hidden md:block absolute top-14 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-green-200 via-blue-200 to-amber-200 z-0" />

            {STEPS.map(({ icon: Icon, title, desc, color, bg, border, iconColor }, i) => (
              <div
                key={title}
                className={`card-hover relative bg-white rounded-2xl p-8 border ${border} shadow-sm text-center group z-10`}
              >
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gradient-to-br ${color} text-white text-xs font-extrabold flex items-center justify-center shadow-md`}>
                  {i + 1}
                </div>
                <div className={`w-16 h-16 ${bg} ${iconColor} rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-6 px-8 text-center text-sm">
        <p>© 2026 <span className="text-white font-semibold">Animal Explorer</span></p>
      </footer>
    </div>
  );
};

export default Home;
