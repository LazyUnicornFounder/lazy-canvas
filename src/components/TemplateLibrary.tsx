import { useState, useEffect } from "react";
import { Sparkles, LayoutGrid } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { QuoteEditorState } from "@/components/QuoteEditor";
import { DEFAULT_EDITOR_STATE } from "@/components/QuoteEditor";

interface Template {
  id: string;
  name: string;
  category: string;
  editorState: Partial<QuoteEditorState>;
  isDb?: boolean;
}

const BUILTIN_TEMPLATES: Template[] = [
  {
    id: "minimal-light",
    name: "Minimal Light",
    category: "minimal",
    editorState: {
      font: "inter",
      theme: "light",
      fontSize: 1.3,
      textAlign: "center",
      letterSpacing: 0.5,
      lineHeight: 1.8,
      textColor: "#1a1a1a",
      authorFont: "inter",
      authorColor: "#888888",
      authorFontSize: 0.75,
      isBold: false,
      isItalic: false,
      backgroundFilter: "none",
      backgroundColor: "",
      textShadow: "none",
    },
  },
  {
    id: "minimal-dark",
    name: "Minimal Dark",
    category: "minimal",
    editorState: {
      font: "heading",
      theme: "dark",
      fontSize: 1.4,
      textAlign: "center",
      letterSpacing: 1,
      lineHeight: 1.7,
      textColor: "#f0f0f0",
      authorFont: "heading",
      authorColor: "#999999",
      authorFontSize: 0.8,
      isBold: false,
      isItalic: false,
      textShadow: "none",
    },
  },
  {
    id: "elegant-serif",
    name: "Elegant Serif",
    category: "elegant",
    editorState: {
      font: "playfair",
      theme: "cream",
      fontSize: 1.5,
      textAlign: "center",
      letterSpacing: 0,
      lineHeight: 1.7,
      textColor: "#2c1810",
      authorFont: "cormorant",
      authorColor: "#8b7355",
      authorFontSize: 0.9,
      isBold: false,
      isItalic: true,
      showQuotationMarks: true,
      textShadow: "none",
    },
  },
  {
    id: "vintage-warm",
    name: "Vintage",
    category: "retro",
    editorState: {
      font: "lora",
      theme: "cream",
      fontSize: 1.3,
      textAlign: "center",
      letterSpacing: 0.5,
      lineHeight: 1.8,
      textColor: "#3d2b1f",
      authorFont: "crimson",
      authorColor: "#7a6652",
      authorFontSize: 0.85,
      isBold: false,
      isItalic: true,
      backgroundFilter: "vintage",
      backgroundColor: "#f5e6d0",
      showQuotationMarks: true,
    },
  },
  {
    id: "bold-modern",
    name: "Bold Modern",
    category: "bold",
    editorState: {
      font: "bebas",
      theme: "dark",
      fontSize: 2.0,
      textAlign: "left",
      letterSpacing: 2,
      lineHeight: 1.3,
      textColor: "#ffffff",
      authorFont: "heading",
      authorColor: "#cccccc",
      authorFontSize: 0.8,
      isBold: true,
      isItalic: false,
      textShadow: "none",
    },
  },
  {
    id: "neon-glow",
    name: "Neon Glow",
    category: "bold",
    editorState: {
      font: "oswald",
      theme: "ink",
      fontSize: 1.6,
      textAlign: "center",
      letterSpacing: 3,
      lineHeight: 1.5,
      textColor: "#00ff88",
      authorFont: "mono",
      authorColor: "#00cc6a",
      authorFontSize: 0.75,
      isBold: true,
      isItalic: false,
      textShadow: "glow",
    },
  },
  {
    id: "handwritten",
    name: "Handwritten",
    category: "playful",
    editorState: {
      font: "caveat",
      theme: "cream",
      fontSize: 1.8,
      textAlign: "center",
      letterSpacing: 0,
      lineHeight: 1.5,
      textColor: "#333333",
      authorFont: "shadows-into-light",
      authorColor: "#666666",
      authorFontSize: 0.9,
      isBold: false,
      isItalic: false,
      textShadow: "none",
    },
  },
  {
    id: "script-luxury",
    name: "Luxury Script",
    category: "elegant",
    editorState: {
      font: "great-vibes",
      theme: "dark",
      fontSize: 1.8,
      textAlign: "center",
      letterSpacing: 0,
      lineHeight: 1.6,
      textColor: "#d4af37",
      authorFont: "raleway",
      authorColor: "#b8960c",
      authorFontSize: 0.75,
      isBold: false,
      isItalic: false,
      backgroundColor: "#0a0a0a",
      textShadow: "soft",
    },
  },
  {
    id: "futuristic",
    name: "Futuristic",
    category: "bold",
    editorState: {
      font: "orbitron",
      theme: "ink",
      fontSize: 1.2,
      textAlign: "center",
      letterSpacing: 4,
      lineHeight: 1.8,
      textColor: "#00d4ff",
      authorFont: "rajdhani",
      authorColor: "#0099bb",
      authorFontSize: 0.7,
      isBold: false,
      isItalic: false,
      textShadow: "glow",
    },
  },
  {
    id: "editorial",
    name: "Editorial",
    category: "minimal",
    editorState: {
      font: "cormorant",
      theme: "light",
      fontSize: 1.6,
      textAlign: "left",
      letterSpacing: 0,
      lineHeight: 1.6,
      textColor: "#111111",
      authorFont: "heading",
      authorColor: "#555555",
      authorFontSize: 0.7,
      isBold: false,
      isItalic: true,
      showQuotationMarks: true,
      textShadow: "none",
    },
  },
  {
    id: "film-noir",
    name: "Film Noir",
    category: "retro",
    editorState: {
      font: "merriweather",
      theme: "dark",
      fontSize: 1.3,
      textAlign: "center",
      letterSpacing: 1,
      lineHeight: 1.8,
      textColor: "#e0e0e0",
      authorFont: "crimson",
      authorColor: "#aaaaaa",
      authorFontSize: 0.8,
      isBold: false,
      isItalic: true,
      backgroundFilter: "noir",
      textShadow: "soft",
    },
  },
  {
    id: "pop-marker",
    name: "Street Art",
    category: "playful",
    editorState: {
      font: "permanent-marker",
      theme: "light",
      fontSize: 1.6,
      textAlign: "left",
      letterSpacing: 0,
      lineHeight: 1.4,
      textColor: "#ff3366",
      authorFont: "archivo",
      authorColor: "#333333",
      authorFontSize: 0.8,
      isBold: false,
      isItalic: false,
      backgroundColor: "#fff9c4",
      textShadow: "none",
    },
  },
];

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "minimal", label: "Minimal" },
  { value: "elegant", label: "Elegant" },
  { value: "bold", label: "Bold" },
  { value: "retro", label: "Retro" },
  { value: "playful", label: "Playful" },
];

// Font class mapping for preview thumbnails
const FONT_CLASS_MAP: Record<string, string> = {
  playfair: "font-playfair",
  cormorant: "font-cormorant",
  lora: "font-lora",
  merriweather: "font-merriweather",
  crimson: "font-crimson",
  heading: "font-heading",
  inter: "font-inter",
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

const THEME_BG: Record<string, string> = {
  light: "#ffffff",
  dark: "#1a1a1a",
  cream: "#F5F0E8",
  ink: "#0d1117",
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
      {/* Category chips */}
      <div className="flex gap-1.5 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
              category === cat.value
                ? "bg-foreground text-background"
                : "bg-accent text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {filtered.map((template) => {
          const s = template.editorState;
          const bg = s.backgroundColor || THEME_BG[s.theme || "light"] || "#ffffff";
          const textCol = s.textColor || (s.theme === "dark" || s.theme === "ink" ? "#f0f0f0" : "#1a1a1a");
          const fontClass = FONT_CLASS_MAP[s.font || "playfair"] || "font-playfair";

          return (
            <button
              key={template.id}
              onClick={() => onApply(template.editorState)}
              className="group relative rounded-lg overflow-hidden border border-border hover:border-foreground/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ aspectRatio: "1" }}
            >
              {/* Mini preview */}
              <div
                className="absolute inset-0 flex items-center justify-center p-2"
                style={{ backgroundColor: bg }}
              >
                <span
                  className={`${fontClass} text-center leading-tight line-clamp-2`}
                  style={{
                    color: textCol,
                    fontSize: "0.55rem",
                    fontWeight: s.isBold ? "bold" : "normal",
                    fontStyle: s.isItalic ? "italic" : "normal",
                    letterSpacing: s.letterSpacing ? `${Math.min(s.letterSpacing, 2)}px` : undefined,
                  }}
                >
                  {s.showQuotationMarks ? "\u201C" : ""}The quick brown fox{s.showQuotationMarks ? "\u201D" : ""}
                </span>
              </div>
              {/* Label overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent pt-4 pb-1.5 px-1.5">
                <span className="text-[0.6rem] text-white font-medium leading-none">
                  {template.name}
                </span>
              </div>
              {template.isDb && (
                <div className="absolute top-1 right-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">No templates in this category yet.</p>
      )}
    </div>
  );
}
