import React from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";

interface PhoneMockupProps {
  children: React.ReactNode;
  authorName?: string;
  className?: string;
}

const PhoneMockup = ({ children, authorName = "lazyquotes", className = "" }: PhoneMockupProps) => {
  return (
    <div className={`relative ${className}`}>
      {/* Phone frame */}
      <div className="relative bg-[#1a1a1a] rounded-[2.5rem] p-[3px] shadow-2xl shadow-black/30">
        {/* Inner bezel */}
        <div className="bg-black rounded-[2.35rem] overflow-hidden">
          {/* Notch / Dynamic Island */}
          <div className="relative bg-black pt-3 pb-1 px-6 flex justify-center">
            <div className="w-[5.5rem] h-[1.6rem] bg-[#1a1a1a] rounded-full" />
          </div>

          {/* Screen content */}
          <div className="bg-black">
            {/* Status bar */}
            <div className="flex items-center justify-between px-6 py-1">
              <span className="text-white/70 text-[10px] font-medium">9:41</span>
              <div className="flex items-center gap-1">
                <div className="flex gap-[2px]">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-[3px] rounded-sm bg-white/70`} style={{ height: `${4 + i * 2}px` }} />
                  ))}
                </div>
                <div className="w-4 h-2.5 border border-white/70 rounded-[2px] ml-1 relative">
                  <div className="absolute inset-[1px] bg-white/70 rounded-[1px]" style={{ width: "70%" }} />
                </div>
              </div>
            </div>

            {/* App header - Instagram style */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <span className="text-white text-[7px] font-bold">LQ</span>
                  </div>
                </div>
                <div>
                  <p className="text-white text-[10px] font-semibold leading-tight">{authorName}</p>
                  <p className="text-white/50 text-[8px] leading-tight">Original</p>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-white/70" />
            </div>

            {/* The quote image */}
            <div className="w-full">
              {children}
            </div>

            {/* Social engagement bar */}
            <div className="px-4 py-2.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Heart className="w-5 h-5 text-white/90" />
                  <MessageCircle className="w-5 h-5 text-white/90" />
                  <Send className="w-5 h-5 text-white/90" />
                </div>
                <Bookmark className="w-5 h-5 text-white/90" />
              </div>
              <p className="text-white text-[10px] font-semibold">2,847 likes</p>
              <p className="text-white/50 text-[9px]">12 minutes ago</p>
            </div>

            {/* Home indicator */}
            <div className="flex justify-center pb-2 pt-1">
              <div className="w-28 h-1 bg-white/30 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;
