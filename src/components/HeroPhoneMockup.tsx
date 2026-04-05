import { ThumbsUp, MessageSquare, Repeat2, Send, MoreHorizontal, Globe } from "lucide-react";

const HeroPhoneMockup = () => {
  return (
    <div className="relative mx-auto w-[260px]">
      {/* iPhone 17 Pro frame */}
      <div className="relative bg-[#2a2a2c] rounded-[2.8rem] p-[2.5px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.4)]">
        {/* Side buttons */}
        <div className="absolute -left-[2px] top-[6rem] w-[2.5px] h-7 bg-[#3a3a3c] rounded-l-sm" />
        <div className="absolute -left-[2px] top-[9rem] w-[2.5px] h-12 bg-[#3a3a3c] rounded-l-sm" />
        <div className="absolute -left-[2px] top-[11.5rem] w-[2.5px] h-12 bg-[#3a3a3c] rounded-l-sm" />
        <div className="absolute -right-[2px] top-[8rem] w-[2.5px] h-14 bg-[#3a3a3c] rounded-r-sm" />

        <div className="bg-black rounded-[2.6rem] overflow-hidden">
          {/* Dynamic Island */}
          <div className="flex justify-center pt-2.5 pb-0.5 bg-black">
            <div className="w-20 h-[1.2rem] bg-[#1c1c1c] rounded-full" />
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-6 py-0.5 bg-white">
            <span className="text-black/80 text-[8px] font-semibold">9:41</span>
            <div className="flex items-center gap-0.5">
              <div className="flex gap-[1.5px]">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-[2px] rounded-sm bg-black/70" style={{ height: `${2 + i * 1.2}px` }} />
                ))}
              </div>
              <div className="w-3 h-[6px] border border-black/70 rounded-[1.5px] ml-0.5 relative">
                <div className="absolute inset-[0.5px] bg-black/70 rounded-[1px]" style={{ width: "75%" }} />
              </div>
            </div>
          </div>

          {/* LinkedIn header */}
          <div className="bg-white px-2.5 py-1.5 flex items-center gap-1.5 border-b border-[#e8e8e8]">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[7px] font-bold">SM</span>
            </div>
            <div className="flex-1 bg-[#edf3f8] rounded px-2 py-1">
              <span className="text-[7px] text-[#666]">Search</span>
            </div>
            <MessageSquare className="w-3.5 h-3.5 text-[#666]" />
          </div>

          {/* Feed */}
          <div className="bg-[#f4f2ee]">
            {/* Post */}
            <div className="bg-white mt-1.5">
              {/* Post header */}
              <div className="px-2.5 pt-2 pb-1 flex items-start gap-1.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[8px] font-bold">JD</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[8px] font-semibold text-[#191919] leading-tight">Sarah Mitchell</p>
                  <p className="text-[7px] text-[#666] leading-tight">Creative Director · 2nd</p>
                  <div className="flex items-center gap-0.5">
                    <span className="text-[7px] text-[#666]">3h</span>
                    <span className="text-[7px] text-[#666]">·</span>
                    <Globe className="w-2 h-2 text-[#666]" />
                  </div>
                </div>
                <MoreHorizontal className="w-3.5 h-3.5 text-[#666] flex-shrink-0" />
              </div>

              {/* Post text */}
              <div className="px-2.5 pb-1.5">
                <p className="text-[7.5px] text-[#191919] leading-relaxed">
                  This quote has been living in my head all week. Created with @LazyQuotes ✨
                </p>
              </div>

              {/* Quote image */}
              <div className="w-full aspect-square bg-[#1a1a1a] flex items-center justify-center px-6 py-8 relative">
                <div className="text-center space-y-3">
                  <p className="font-playfair text-white text-[11px] leading-relaxed tracking-wide italic">
                    "The only way to do great work is to love what you do. If you haven't found it yet, keep looking."
                  </p>
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="h-[0.5px] w-5 bg-white/30" />
                    <p className="text-white/60 text-[6px] font-medium tracking-[0.15em] uppercase">Steve Jobs</p>
                    <div className="h-[0.5px] w-5 bg-white/30" />
                  </div>
                </div>
                <span className="absolute bottom-1.5 right-2 text-white/15 text-[5px]">made with Lazy Quotes</span>
              </div>

              {/* Reactions */}
              <div className="px-2.5 py-1 flex items-center justify-between border-b border-[#e8e8e8]">
                <div className="flex items-center gap-0.5">
                  <div className="flex -space-x-0.5">
                    <div className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center border border-white">
                      <ThumbsUp className="w-1.5 h-1.5 text-white" />
                    </div>
                    <div className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center border border-white">
                      <span className="text-[4px]">❤️</span>
                    </div>
                  </div>
                  <span className="text-[6.5px] text-[#666] ml-0.5">2,847</span>
                </div>
                <span className="text-[6.5px] text-[#666]">128 comments · 46 reposts</span>
              </div>

              {/* Actions */}
              <div className="px-1 py-0.5 flex items-center justify-around">
                {[
                  { icon: ThumbsUp, label: "Like" },
                  { icon: MessageSquare, label: "Comment" },
                  { icon: Repeat2, label: "Repost" },
                  { icon: Send, label: "Send" },
                ].map(({ icon: Icon, label }) => (
                  <button key={label} className="flex items-center gap-0.5 px-1.5 py-1 rounded">
                    <Icon className="w-3 h-3 text-[#666]" />
                    <span className="text-[6.5px] text-[#666] font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Next post peek */}
            <div className="bg-white mt-1.5 px-2.5 pt-2 pb-4 flex items-start gap-1.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[8px] font-bold">AK</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[8px] font-semibold text-[#191919] leading-tight">Alex Kim</p>
                <p className="text-[7px] text-[#666] leading-tight">Founder & CEO at Nimbus</p>
                <p className="text-[7.5px] text-[#191919] leading-relaxed mt-1">
                  Excited to share our Series A 🚀
                </p>
              </div>
            </div>
          </div>

          {/* Home indicator */}
          <div className="bg-[#f4f2ee] flex justify-center pb-1.5 pt-0.5">
            <div className="w-24 h-[3px] bg-black/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPhoneMockup;
