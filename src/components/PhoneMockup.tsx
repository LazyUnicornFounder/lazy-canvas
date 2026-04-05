import React from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";

interface PhoneMockupProps {
  children: React.ReactNode;
  authorName?: string;
  className?: string;
}

const PhoneMockup = ({ children, authorName = "lazyfaceless", className = "" }: PhoneMockupProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="bg-black">
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
      </div>
    </div>
  );
};

export default PhoneMockup;
