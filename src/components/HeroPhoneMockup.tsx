const HeroPhoneMockup = () => {
  return (
    <div className="relative h-full" style={{ aspectRatio: "71.5 / 149.6" }}>
      <div className="relative rounded-[2.8rem] py-12 px-1 h-full flex items-center">
        {/* Top blur fade */}
        <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none rounded-t-[2.8rem]" />

        {/* Design card — sharp corners */}
        <div className="bg-[#1a1a1a] px-6 py-10">
          <div className="text-center space-y-4">
            <p className="font-playfair text-white text-[13px] leading-relaxed tracking-wide italic">
              "The only way to do great work is to love what you do. If you haven't found it yet, keep looking."
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="h-[0.5px] w-6 bg-white/25" />
              <p className="text-white/50 text-[7px] font-medium tracking-[0.2em] uppercase">Steve Jobs</p>
              <div className="h-[0.5px] w-6 bg-white/25" />
            </div>
          </div>
        </div>

        {/* Bottom blur fade */}
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none rounded-b-[2.8rem]" />
      </div>
    </div>
  );
};

export default HeroPhoneMockup;
