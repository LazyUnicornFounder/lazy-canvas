const HeroPhoneMockup = () => {
  return (
    <div className="relative mx-auto w-[260px]">
      {/* Phone outline */}
      <div className="relative border border-foreground/20 rounded-[2.8rem] overflow-hidden">
        {/* Top blur fade */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />

        {/* Content area */}
        <div className="px-5 py-20">
          {/* Quote */}
          <div className="text-center space-y-4">
            <p className="font-playfair text-foreground text-[13px] leading-relaxed tracking-wide italic">
              "The only way to do great work is to love what you do. If you haven't found it yet, keep looking."
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="h-[0.5px] w-6 bg-foreground/20" />
              <p className="text-muted-foreground text-[7px] font-medium tracking-[0.2em] uppercase">Steve Jobs</p>
              <div className="h-[0.5px] w-6 bg-foreground/20" />
            </div>
          </div>
        </div>

        {/* Bottom blur fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  );
};

export default HeroPhoneMockup;
