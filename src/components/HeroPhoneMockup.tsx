import { ThumbsUp, MessageSquare, Repeat2, Send, MoreHorizontal, Globe, Bookmark } from "lucide-react";

const HeroPhoneMockup = () => {
  return (
    <div className="relative mx-auto flex items-center justify-center" style={{ height: "100%", maxHeight: "60vh" }}>
      {/* Scale wrapper to maintain phone aspect ratio */}
      <div className="relative h-full" style={{ aspectRatio: "9/19.5" }}>
      <div className="relative bg-[#2a2a2c] rounded-[2.5rem] p-[2.5px] shadow-[0_25px_60px_-12px_rgba(0,0,0,0.35)] h-full overflow-hidden">
        {/* Titanium side buttons */}
        <div className="absolute -left-[2px] top-[7rem] w-[3px] h-8 bg-[#3a3a3c] rounded-l-sm" />
        <div className="absolute -left-[2px] top-[10.5rem] w-[3px] h-14 bg-[#3a3a3c] rounded-l-sm" />
        <div className="absolute -left-[2px] top-[13rem] w-[3px] h-14 bg-[#3a3a3c] rounded-l-sm" />
        <div className="absolute -right-[2px] top-[9rem] w-[3px] h-16 bg-[#3a3a3c] rounded-r-sm" />

        <div className="bg-[#000000] rounded-[2.3rem] overflow-hidden">
          {/* Dynamic Island */}
          <div className="relative bg-black flex justify-center pt-3 pb-1">
            <div className="w-[6rem] h-[1.5rem] bg-[#1a1a1a] rounded-full" />
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-7 py-0.5 bg-white">
            <span className="text-black/80 text-[9px] font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <div className="flex gap-[2px]">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-[2.5px] rounded-sm bg-black/70" style={{ height: `${3 + i * 1.5}px` }} />
                ))}
              </div>
              <div className="w-[14px] h-[8px] border border-black/70 rounded-[2px] ml-0.5 relative">
                <div className="absolute inset-[1px] bg-black/70 rounded-[1px]" style={{ width: "75%" }} />
              </div>
            </div>
          </div>

          {/* LinkedIn app header */}
          <div className="bg-white px-3 py-2 flex items-center gap-2 border-b border-[#e8e8e8]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[9px] font-bold">SM</span>
            </div>
            <div className="flex-1 bg-[#edf3f8] rounded-md px-2.5 py-1.5">
              <span className="text-[9px] text-[#666]">Search</span>
            </div>
            <MessageSquare className="w-4 h-4 text-[#666]" />
          </div>

          {/* Feed content */}
          <div className="bg-[#f4f2ee]">
            {/* Post */}
            <div className="bg-white mt-2">
              {/* Post header */}
              <div className="px-3 pt-3 pb-1.5 flex items-start gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[10px] font-bold">JD</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-[#191919] leading-tight">Sarah Mitchell</p>
                  <p className="text-[8px] text-[#666] leading-tight mt-0.5">Creative Director · 2nd</p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <span className="text-[8px] text-[#666]">3h</span>
                    <span className="text-[8px] text-[#666]">·</span>
                    <Globe className="w-2.5 h-2.5 text-[#666]" />
                  </div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-[#666] flex-shrink-0" />
              </div>

              {/* Post text */}
              <div className="px-3 pb-2">
                <p className="text-[9px] text-[#191919] leading-relaxed">
                  This quote has been living in my head all week. Created with @LazyQuotes ✨
                </p>
              </div>

              {/* Quote image — the hero piece */}
              <div className="w-full aspect-square bg-[#1a1a1a] flex items-center justify-center p-8 relative">
                <div className="text-center space-y-4">
                  <p className="font-playfair text-white text-[13px] leading-relaxed tracking-wide italic">
                    "The only way to do great work is to love what you do. If you haven't found it yet, keep looking."
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-[1px] w-6 bg-white/30" />
                    <p className="text-white/60 text-[8px] font-medium tracking-widest uppercase">Steve Jobs</p>
                    <div className="h-[1px] w-6 bg-white/30" />
                  </div>
                </div>
                {/* Subtle watermark */}
                <div className="absolute bottom-2 right-3">
                  <span className="text-white/20 text-[6px] font-medium">made with Lazy Quotes</span>
                </div>
              </div>

              {/* Reactions summary */}
              <div className="px-3 py-1.5 flex items-center justify-between border-b border-[#e8e8e8]">
                <div className="flex items-center gap-0.5">
                  <div className="flex -space-x-1">
                    <div className="w-[14px] h-[14px] rounded-full bg-blue-500 flex items-center justify-center border border-white">
                      <ThumbsUp className="w-2 h-2 text-white" />
                    </div>
                    <div className="w-[14px] h-[14px] rounded-full bg-red-500 flex items-center justify-center border border-white">
                      <span className="text-[6px]">❤️</span>
                    </div>
                    <div className="w-[14px] h-[14px] rounded-full bg-green-600 flex items-center justify-center border border-white">
                      <span className="text-[6px]">👏</span>
                    </div>
                  </div>
                  <span className="text-[8px] text-[#666] ml-1">2,847</span>
                </div>
                <span className="text-[8px] text-[#666]">128 comments · 46 reposts</span>
              </div>

              {/* Action buttons */}
              <div className="px-2 py-1 flex items-center justify-around">
                {[
                  { icon: ThumbsUp, label: "Like" },
                  { icon: MessageSquare, label: "Comment" },
                  { icon: Repeat2, label: "Repost" },
                  { icon: Send, label: "Send" },
                ].map(({ icon: Icon, label }) => (
                  <button key={label} className="flex items-center gap-1 px-2 py-1.5 rounded">
                    <Icon className="w-3.5 h-3.5 text-[#666]" />
                    <span className="text-[8px] text-[#666] font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Peek of next post */}
            <div className="bg-white mt-2 px-3 pt-3 pb-6 flex items-start gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] font-bold">AK</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-[#191919] leading-tight">Alex Kim</p>
                <p className="text-[8px] text-[#666] leading-tight mt-0.5">Founder & CEO at Nimbus</p>
                <p className="text-[9px] text-[#191919] leading-relaxed mt-1.5">
                  Excited to share our Series A 🚀
                </p>
              </div>
            </div>
          </div>

          {/* Home indicator */}
          <div className="bg-[#f4f2ee] flex justify-center pb-2 pt-1">
            <div className="w-28 h-1 bg-black/20 rounded-full" />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default HeroPhoneMockup;
