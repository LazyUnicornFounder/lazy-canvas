import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { QuoteEditorState } from "@/components/QuoteEditor";

// Template background images
import imgWhisper from "@/assets/templates/whisper.jpg";
import imgMonochrome from "@/assets/templates/monochrome.jpg";
import imgPaper from "@/assets/templates/paper.jpg";
import imgGoldenHour from "@/assets/templates/golden-hour.jpg";
import imgBlush from "@/assets/templates/blush.jpg";
import imgMatcha from "@/assets/templates/matcha.jpg";
import imgLavender from "@/assets/templates/lavender.jpg";
import imgOcean from "@/assets/templates/ocean.jpg";
import imgImpact from "@/assets/templates/impact.jpg";
import imgElectric from "@/assets/templates/electric.jpg";
import imgFire from "@/assets/templates/fire.jpg";
import imgAcid from "@/assets/templates/acid.jpg";
import imgPolaroid from "@/assets/templates/polaroid.jpg";
import imgTypewriter from "@/assets/templates/typewriter.jpg";
import imgCinema from "@/assets/templates/cinema.jpg";
import imgSepia from "@/assets/templates/sepia.jpg";
import imgGoldNoir from "@/assets/templates/gold-noir.jpg";
import imgMarble from "@/assets/templates/marble.jpg";
import imgChampagne from "@/assets/templates/champagne.jpg";
import imgMidnight from "@/assets/templates/midnight.jpg";
import imgMarker from "@/assets/templates/marker.jpg";
import imgBubblegum from "@/assets/templates/bubblegum.jpg";
import imgSunshine from "@/assets/templates/sunshine.jpg";

interface Template {
  id: string;
  name: string;
  category: string;
  editorState: Partial<QuoteEditorState>;
  previewImage?: string;
  isDb?: boolean;
}

const TEMPLATE_IMAGES: Record<string, string> = {
  whisper: imgWhisper,
  monochrome: imgMonochrome,
  paper: imgPaper,
  "sunset-gradient": imgGoldenHour,
  "aesthetic-pink": imgBlush,
  matcha: imgMatcha,
  "lavender-dream": imgLavender,
  "ocean-mist": imgOcean,
  impact: imgImpact,
  electric: imgElectric,
  fire: imgFire,
  acid: imgAcid,
  polaroid: imgPolaroid,
  typewriter: imgTypewriter,
  cinema: imgCinema,
  sepia: imgSepia,
  "gold-noir": imgGoldNoir,
  marble: imgMarble,
  champagne: imgChampagne,
  midnight: imgMidnight,
  marker: imgMarker,
  bubblegum: imgBubblegum,
  sunshine: imgSunshine,
};

const BUILTIN_TEMPLATES: Template[] = [
  // ── MINIMAL ──
  {
    id: "whisper",
    name: "Whisper",
    category: "minimal",
    editorState: {
      font: "inter",
      theme: "light",
      fontSize: 1.2,
      textAlign: "center",
      letterSpacing: 2,
      lineHeight: 2.2,
      textColor: "#9ca3af",
      authorFont: "inter",
      authorColor: "#d1d5db",
      authorFontSize: 0.65,
      isBold: false,
      isItalic: false,
      backgroundColor: "#fafafa",
      textShadow: "none",
      backgroundFilter: "none",
      showQuotationMarks: false,
    },
  },
  {
    id: "monochrome",
    name: "Monochrome",
    category: "minimal",
    editorState: {
      font: "heading",
      theme: "dark",
      fontSize: 1.5,
      textAlign: "left",
      letterSpacing: -0.5,
      lineHeight: 1.3,
      textColor: "#ffffff",
      authorFont: "heading",
      authorColor: "#525252",
      authorFontSize: 0.7,
      isBold: true,
      isItalic: false,
      backgroundColor: "#0a0a0a",
      textShadow: "none",
      showQuotationMarks: false,
    },
  },
  {
    id: "paper",
    name: "Paper",
    category: "minimal",
    editorState: {
      font: "cormorant",
      theme: "cream",
      fontSize: 1.5,
      textAlign: "center",
      letterSpacing: 0,
      lineHeight: 1.7,
      textColor: "#44403c",
      authorFont: "heading",
      authorColor: "#a8a29e",
      authorFontSize: 0.65,
      isBold: false,
      isItalic: true,
      backgroundColor: "#f5f0e8",
      textShadow: "none",
      showQuotationMarks: true,
    },
  },

  // ── TRENDY / INSTAGRAM ──
  {
    id: "sunset-gradient",
    name: "Golden Hour",
    category: "trendy",
    editorState: {
      font: "raleway",
      theme: "dark",
      fontSize: 1.4,
      textAlign: "center",
      letterSpacing: 1,
      lineHeight: 1.7,
      textColor: "#fef3c7",
      authorFont: "raleway",
      authorColor: "#fbbf24",
      authorFontSize: 0.75,
      isBold: false,
      isItalic: false,
      backgroundColor: "#78350f",
      textShadow: "soft",
      showQuotationMarks: false,
    },
  },
  {
    id: "aesthetic-pink",
    name: "Blush",
    category: "trendy",
    editorState: {
      font: "poppins",
      theme: "light",
      fontSize: 1.3,
      textAlign: "center",
      letterSpacing: 0.5,
      lineHeight: 1.8,
      textColor: "#831843",
      authorFont: "poppins",
      authorColor: "#be185d",
      authorFontSize: 0.7,
      isBold: false,
      isItalic: false,
      backgroundColor: "#fdf2f8",
      textShadow: "none",
      showQuotationMarks: false,
    },
  },
  {
    id: "matcha",
    name: "Matcha",
    category: "trendy",
    editorState: {
      font: "heading",
      theme: "light",
      fontSize: 1.3,
      textAlign: "center",
      letterSpacing: 0,
      lineHeight: 1.8,
      textColor: "#14532d",
      authorFont: "heading",
      authorColor: "#15803d",
      authorFontSize: 0.7,
      isBold: false,
      isItalic: false,
      backgroundColor: "#ecfdf5",
      textShadow: "none",
      showQuotationMarks: false,
    },
  },
  {
    id: "lavender-dream",
    name: "Lavender",
    category: "trendy",
    editorState: {
      font: "montserrat",
      theme: "light",
      fontSize: 1.3,
      textAlign: "center",
      letterSpacing: 0.5,
      lineHeight: 1.8,
      textColor: "#581c87",
      authorFont: "montserrat",
      authorColor: "#7e22ce",
      authorFontSize: 0.7,
      isBold: false,
      isItalic: false,
      backgroundColor: "#f3e8ff",
      textShadow: "none",
      showQuotationMarks: false,
    },
  },
  {
    id: "ocean-mist",
    name: "Ocean",
    category: "trendy",
    editorState: {
      font: "lora",
      theme: "dark",
      fontSize: 1.4,
      textAlign: "center",
      letterSpacing: 0,
      lineHeight: 1.7,
      textColor: "#e0f2fe",
      authorFont: "heading",
      authorColor: "#38bdf8",
      authorFontSize: 0.7,
      isBold: false,
      isItalic: true,
      backgroundColor: "#0c4a6e",
      textShadow: "soft",
      showQuotationMarks: true,
    },
  },

  // ── BOLD ──
  {
    id: "impact",
    name: "Impact",
    category: "bold",
    editorState: {
      font: "bebas",
      theme: "dark",
      fontSize: 2.4,
      textAlign: "center",
      letterSpacing: 4,
      lineHeight: 1.1,
      textColor: "#ffffff",
      authorFont: "heading",
      authorColor: "#737373",
      authorFontSize: 0.7,
      isBold: true,
      isItalic: false,
      backgroundColor: "#000000",
      textShadow: "none",
      showQuotationMarks: false,
    },
  },
  {
    id: "electric",
    name: "Electric",
    category: "bold",
    editorState: {
      font: "oswald",
      theme: "ink",
      fontSize: 1.8,
      textAlign: "center",
      letterSpacing: 3,
      lineHeight: 1.4,
      textColor: "#22d3ee",
      authorFont: "mono",
      authorColor: "#06b6d4",
      authorFontSize: 0.65,
      isBold: true,
      isItalic: false,
      backgroundColor: "#020617",
      textShadow: "glow",
      showQuotationMarks: false,
    },
  },
  {
    id: "fire",
    name: "Fire",
    category: "bold",
    editorState: {
      font: "archivo",
      theme: "dark",
      fontSize: 1.8,
      textAlign: "left",
      letterSpacing: 1,
      lineHeight: 1.3,
      textColor: "#fbbf24",
      authorFont: "heading",
      authorColor: "#f59e0b",
      authorFontSize: 0.75,
      isBold: true,
      isItalic: false,
      backgroundColor: "#1c1917",
      textShadow: "soft",
      showQuotationMarks: false,
    },
  },
  {
    id: "acid",
    name: "Acid",
    category: "bold",
    editorState: {
      font: "orbitron",
      theme: "ink",
      fontSize: 1.2,
      textAlign: "center",
      letterSpacing: 5,
      lineHeight: 1.8,
      textColor: "#a3e635",
      authorFont: "rajdhani",
      authorColor: "#84cc16",
      authorFontSize: 0.65,
      isBold: false,
      isItalic: false,
      backgroundColor: "#0a0a0a",
      textShadow: "glow",
      showQuotationMarks: false,
    },
  },

  // ── VINTAGE / RETRO ──
  {
    id: "polaroid",
    name: "Polaroid",
    category: "retro",
    editorState: {
      font: "caveat",
      theme: "cream",
      fontSize: 1.8,
      textAlign: "center",
      letterSpacing: 0,
      lineHeight: 1.4,
      textColor: "#292524",
      authorFont: "shadows-into-light",
      authorColor: "#78716c",
      authorFontSize: 0.9,
      isBold: false,
      isItalic: false,
      backgroundColor: "#faf7f2",
      textShadow: "none",
      backgroundFilter: "vintage",
      showQuotationMarks: false,
    },
  },
  {
    id: "typewriter",
    name: "Typewriter",
    category: "retro",
    editorState: {
      font: "mono",
      theme: "cream",
      fontSize: 1.1,
      textAlign: "left",
      letterSpacing: 1,
      lineHeight: 2.0,
      textColor: "#1c1917",
      authorFont: "mono",
      authorColor: "#57534e",
      authorFontSize: 0.7,
      isBold: false,
      isItalic: false,
      backgroundColor: "#f5f0e1",
      textShadow: "none",
      showQuotationMarks: false,
    },
  },
  {
    id: "cinema",
    name: "Cinema",
    category: "retro",
    editorState: {
      font: "playfair",
      theme: "dark",
      fontSize: 1.4,
      textAlign: "center",
      letterSpacing: 2,
      lineHeight: 1.8,
      textColor: "#d4d4d8",
      authorFont: "crimson",
      authorColor: "#71717a",
      authorFontSize: 0.8,
      isBold: false,
      isItalic: true,
      backgroundColor: "#18181b",
      textShadow: "soft",
      backgroundFilter: "film",
      showQuotationMarks: true,
    },
  },
  {
    id: "sepia",
    name: "Sepia",
    category: "retro",
    editorState: {
      font: "merriweather",
      theme: "cream",
      fontSize: 1.2,
      textAlign: "center",
      letterSpacing: 0.5,
      lineHeight: 1.9,
      textColor: "#44403c",
      authorFont: "lora",
      authorColor: "#78716c",
      authorFontSize: 0.75,
      isBold: false,
      isItalic: true,
      backgroundColor: "#ede0c8",
      textShadow: "none",
      backgroundFilter: "vintage",
      showQuotationMarks: true,
    },
  },

  // ── ELEGANT ──
  {
    id: "gold-noir",
    name: "Gold Noir",
    category: "elegant",
    editorState: {
      font: "great-vibes",
      theme: "dark",
      fontSize: 2.0,
      textAlign: "center",
      letterSpacing: 0,
      lineHeight: 1.5,
      textColor: "#d4a574",
      authorFont: "raleway",
      authorColor: "#a3845c",
      authorFontSize: 0.7,
      isBold: false,
      isItalic: false,
      backgroundColor: "#0c0a09",
      textShadow: "soft",
      showQuotationMarks: false,
    },
  },
  {
    id: "marble",
    name: "Marble",
    category: "elegant",
    editorState: {
      font: "cormorant",
      theme: "light",
      fontSize: 1.6,
      textAlign: "center",
      letterSpacing: 3,
      lineHeight: 1.7,
      textColor: "#1c1917",
      authorFont: "heading",
      authorColor: "#78716c",
      authorFontSize: 0.65,
      isBold: false,
      isItalic: false,
      backgroundColor: "#f5f5f4",
      textShadow: "none",
      showQuotationMarks: true,
    },
  },
  {
    id: "champagne",
    name: "Champagne",
    category: "elegant",
    editorState: {
      font: "playfair",
      theme: "cream",
      fontSize: 1.4,
      textAlign: "center",
      letterSpacing: 1,
      lineHeight: 1.8,
      textColor: "#78350f",
      authorFont: "raleway",
      authorColor: "#92400e",
      authorFontSize: 0.7,
      isBold: false,
      isItalic: true,
      backgroundColor: "#fef3c7",
      textShadow: "none",
      showQuotationMarks: true,
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    category: "elegant",
    editorState: {
      font: "dancing",
      theme: "ink",
      fontSize: 1.8,
      textAlign: "center",
      letterSpacing: 0,
      lineHeight: 1.5,
      textColor: "#c4b5fd",
      authorFont: "montserrat",
      authorColor: "#8b5cf6",
      authorFontSize: 0.65,
      isBold: false,
      isItalic: false,
      backgroundColor: "#0f0720",
      textShadow: "glow",
      showQuotationMarks: false,
    },
  },

  // ── PLAYFUL ──
  {
    id: "marker",
    name: "Marker",
    category: "playful",
    editorState: {
      font: "permanent-marker",
      theme: "light",
      fontSize: 1.6,
      textAlign: "left",
      letterSpacing: 0,
      lineHeight: 1.4,
      textColor: "#e11d48",
      authorFont: "caveat",
      authorColor: "#f43f5e",
      authorFontSize: 0.9,
      isBold: false,
      isItalic: false,
      backgroundColor: "#fff1f2",
      textShadow: "none",
      showQuotationMarks: false,
    },
  },
  {
    id: "bubblegum",
    name: "Bubblegum",
    category: "playful",
    editorState: {
      font: "pacifico",
      theme: "light",
      fontSize: 1.5,
      textAlign: "center",
      letterSpacing: 0,
      lineHeight: 1.5,
      textColor: "#a21caf",
      authorFont: "poppins",
      authorColor: "#c026d3",
      authorFontSize: 0.7,
      isBold: false,
      isItalic: false,
      backgroundColor: "#fae8ff",
      textShadow: "none",
      showQuotationMarks: false,
    },
  },
  {
    id: "sunshine",
    name: "Sunshine",
    category: "playful",
    editorState: {
      font: "satisfy",
      theme: "light",
      fontSize: 1.7,
      textAlign: "center",
      letterSpacing: 0,
      lineHeight: 1.5,
      textColor: "#b45309",
      authorFont: "heading",
      authorColor: "#d97706",
      authorFontSize: 0.75,
      isBold: false,
      isItalic: false,
      backgroundColor: "#fffbeb",
      textShadow: "none",
      showQuotationMarks: false,
    },
  },
];

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "trendy", label: "Trending" },
  { value: "minimal", label: "Minimal" },
  { value: "elegant", label: "Elegant" },
  { value: "bold", label: "Bold" },
  { value: "retro", label: "Retro" },
  { value: "playful", label: "Playful" },
];

const FONT_CLASS_MAP: Record<string, string> = {
  playfair: "font-playfair",
  cormorant: "font-cormorant",
  lora: "font-lora",
  merriweather: "font-merriweather",
  crimson: "font-crimson",
  heading: "font-heading",
  inter: "font-inter",
  "dm-sans": "font-dm-sans",
  raleway: "font-raleway",
  montserrat: "font-montserrat",
  poppins: "font-poppins",
  oswald: "font-oswald",
  bebas: "font-bebas",
  archivo: "font-archivo",
  mono: "font-mono",
  dancing: "font-dancing",
  pacifico: "font-pacifico",
  "great-vibes": "font-great-vibes",
  satisfy: "font-satisfy",
  caveat: "font-caveat",
  "permanent-marker": "font-permanent-marker",
  "shadows-into-light": "font-shadows-into-light",
  orbitron: "font-orbitron",
  rajdhani: "font-rajdhani",
  audiowide: "font-audiowide",
};

const PREVIEW_QUOTES: Record<string, { text: string; author: string }> = {
  whisper: { text: "Less is more.", author: "Ludwig Mies van der Rohe" },
  monochrome: { text: "BE YOURSELF. EVERYONE ELSE IS TAKEN.", author: "Oscar Wilde" },
  paper: { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  "sunset-gradient": { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  "aesthetic-pink": { text: "She believed she could, so she did.", author: "R.S. Grey" },
  matcha: { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  "lavender-dream": { text: "We are such stuff as dreams are made on.", author: "William Shakespeare" },
  "ocean-mist": { text: "The cure for anything is salt water: sweat, tears, or the sea.", author: "Isak Dinesen" },
  impact: { text: "DO OR DO NOT. THERE IS NO TRY.", author: "Yoda" },
  electric: { text: "THE FUTURE BELONGS TO THOSE WHO BELIEVE IN THE BEAUTY OF THEIR DREAMS.", author: "Eleanor Roosevelt" },
  fire: { text: "SET YOUR LIFE ON FIRE. SEEK THOSE WHO FAN YOUR FLAMES.", author: "Rumi" },
  acid: { text: "STAY HUNGRY. STAY FOOLISH.", author: "Steve Jobs" },
  polaroid: { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  typewriter: { text: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou" },
  cinema: { text: "After all, tomorrow is another day.", author: "Scarlett O'Hara" },
  sepia: { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  "gold-noir": { text: "Elegance is not standing out, but being remembered.", author: "Giorgio Armani" },
  marble: { text: "SIMPLICITY IS THE ULTIMATE SOPHISTICATION.", author: "Leonardo da Vinci" },
  champagne: { text: "I drink champagne when I win, to celebrate… and when I lose, to console myself.", author: "Napoleon Bonaparte" },
  midnight: { text: "We are all in the gutter, but some of us are looking at the stars.", author: "Oscar Wilde" },
  marker: { text: "ART IS NOT WHAT YOU SEE, BUT WHAT YOU MAKE OTHERS SEE.", author: "Edgar Degas" },
  bubblegum: { text: "Be happy for this moment. This moment is your life.", author: "Omar Khayyam" },
  sunshine: { text: "Keep your face always toward the sunshine and shadows will fall behind you.", author: "Walt Whitman" },
};

interface TemplateLibraryProps {
  onApply: (state: Partial<QuoteEditorState>) => void;
}

export default function TemplateLibrary({ onApply }: TemplateLibraryProps) {
  const [category, setCategory] = useState("all");
  const [dbTemplates, setDbTemplates] = useState<Template[]>([]);

  useEffect(() => {
    supabase
      .from("quote_templates")
      .select("*")
      .order("display_order")
      .then(({ data }) => {
        if (data) {
          setDbTemplates(
            data.map((t) => ({
              id: t.id,
              name: t.name,
              category: t.category,
              editorState: t.editor_state as Partial<QuoteEditorState>,
              isDb: true,
            }))
          );
        }
      });
  }, []);

  const allTemplates = [...BUILTIN_TEMPLATES, ...dbTemplates];
  const filtered =
    category === "all"
      ? allTemplates
      : allTemplates.filter((t) => t.category === category);

  return (
    <div className="space-y-3">
      {/* Category pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-all ${
              category === cat.value
                ? "bg-foreground text-background shadow-sm"
                : "bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {filtered.map((template) => {
          const s = template.editorState;
          const textCol = s.textColor || "#1a1a1a";
          const fontClass = FONT_CLASS_MAP[s.font || "playfair"] || "font-playfair";
          const quoteData = PREVIEW_QUOTES[template.id];
          const previewText = quoteData?.text || "the quick fox";
          const previewAuthor = quoteData?.author || "";
          const bgImage = TEMPLATE_IMAGES[template.id];

          return (
            <button
              key={template.id}
              onClick={() => onApply(template.editorState)}
              className="group relative rounded-xl overflow-hidden border border-border/50 hover:border-foreground/20 transition-all duration-200 hover:shadow-lg hover:scale-[1.03] active:scale-[0.97]"
              style={{ aspectRatio: "3/4" }}
            >
              {/* Background image */}
              {bgImage && (
                <img
                  src={bgImage}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              {/* Dark overlay for readability */}
              <div className="absolute inset-0 bg-black/20" />

              {/* Preview text */}
              <div className="absolute inset-0 flex items-center justify-center p-3 z-10">
                <span
                  className={`${fontClass} text-center leading-tight drop-shadow-md`}
                  style={{
                    color: textCol,
                    fontSize: "0.7rem",
                    fontWeight: s.isBold ? "bold" : "normal",
                    fontStyle: s.isItalic ? "italic" : "normal",
                    letterSpacing: s.letterSpacing
                      ? `${Math.min(s.letterSpacing, 3)}px`
                      : undefined,
                    lineHeight: s.lineHeight ? Math.min(s.lineHeight, 1.8) : undefined,
                    textAlign: (s.textAlign as CanvasTextAlign) || "center",
                    textShadow:
                      s.textShadow === "glow"
                        ? `0 0 10px ${textCol}66`
                        : `0 1px 4px rgba(0,0,0,0.5)`,
                  }}
                >
                  {s.showQuotationMarks ? "\u201C" : ""}
                  {previewText}
                  {s.showQuotationMarks ? "\u201D" : ""}
                </span>
              </div>

              {/* Name label */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-6 pb-2 px-2 z-10">
                <span className="text-[0.65rem] text-white font-medium tracking-wide">
                  {template.name}
                </span>
              </div>

              {/* DB badge */}
              {template.isDb && (
                <div className="absolute top-1.5 right-1.5 z-10">
                  <Sparkles className="w-3 h-3 text-amber-400 drop-shadow" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-6">
          No templates in this category yet.
        </p>
      )}
    </div>
  );
}
