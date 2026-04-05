import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { QuoteEditorState } from "@/components/QuoteEditor";

interface Template {
  id: string;
  name: string;
  category: string;
  editorState: Partial<QuoteEditorState>;
  previewImage?: string;
  isDb?: boolean;
}

// Pexels images (free to use, attribution: pexels.com)
const PEXELS_IMAGES: Record<string, string> = {
  whisper: "https://images.pexels.com/photos/9656153/pexels-photo-9656153.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  monochrome: "https://images.pexels.com/photos/19065667/pexels-photo-19065667.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  paper: "https://images.pexels.com/photos/17204370/pexels-photo-17204370.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "sunset-gradient": "https://images.pexels.com/photos/18255040/pexels-photo-18255040.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "aesthetic-pink": "https://images.pexels.com/photos/13092315/pexels-photo-13092315.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  matcha: "https://images.pexels.com/photos/8951881/pexels-photo-8951881.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "lavender-dream": "https://images.pexels.com/photos/655022/pexels-photo-655022.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "ocean-mist": "https://images.pexels.com/photos/10813428/pexels-photo-10813428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  impact: "https://images.pexels.com/photos/4107337/pexels-photo-4107337.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  electric: "https://images.pexels.com/photos/1687516/pexels-photo-1687516.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  fire: "https://images.pexels.com/photos/11716838/pexels-photo-11716838.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  acid: "https://images.pexels.com/photos/1687516/pexels-photo-1687516.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  polaroid: "https://images.pexels.com/photos/6062850/pexels-photo-6062850.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  typewriter: "https://images.pexels.com/photos/102100/pexels-photo-102100.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  cinema: "https://images.pexels.com/photos/18647355/pexels-photo-18647355.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  sepia: "https://images.pexels.com/photos/15331248/pexels-photo-15331248.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "gold-noir": "https://images.pexels.com/photos/11631545/pexels-photo-11631545.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  marble: "https://images.pexels.com/photos/14583331/pexels-photo-14583331.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  champagne: "https://images.pexels.com/photos/33228105/pexels-photo-33228105.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  midnight: "https://images.pexels.com/photos/6807016/pexels-photo-6807016.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  marker: "https://images.pexels.com/photos/3357919/pexels-photo-3357919.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  bubblegum: "https://images.pexels.com/photos/30601009/pexels-photo-30601009.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  sunshine: "https://images.pexels.com/photos/7434242/pexels-photo-7434242.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "food-rustic": "https://images.pexels.com/photos/16620746/pexels-photo-16620746.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "sports-stadium": "https://images.pexels.com/photos/18780415/pexels-photo-18780415.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "home-cozy": "https://images.pexels.com/photos/6043981/pexels-photo-6043981.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "garden-bloom": "https://images.pexels.com/photos/28665325/pexels-photo-28665325.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "construction-sunset": "https://images.pexels.com/photos/16612657/pexels-photo-16612657.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "ai-neural": "https://images.pexels.com/photos/33596415/pexels-photo-33596415.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "fashion-silk": "https://images.pexels.com/photos/31034512/pexels-photo-31034512.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "film-set": "https://images.pexels.com/photos/28177107/pexels-photo-28177107.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "games-arcade": "https://images.pexels.com/photos/29702647/pexels-photo-29702647.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "weather-storm": "https://images.pexels.com/photos/12008659/pexels-photo-12008659.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "travel-paradise": "https://images.pexels.com/photos/34616717/pexels-photo-34616717.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "music-stage": "https://images.pexels.com/photos/2247678/pexels-photo-2247678.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "fitness-gym": "https://images.pexels.com/photos/10518845/pexels-photo-10518845.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "nature-peaks": "https://images.pexels.com/photos/16448010/pexels-photo-16448010.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "space-nebula": "https://images.pexels.com/photos/33931027/pexels-photo-33931027.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "coffee-latte": "https://images.pexels.com/photos/36848520/pexels-photo-36848520.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "pets-golden": "https://images.pexels.com/photos/11927589/pexels-photo-11927589.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "books-library": "https://images.pexels.com/photos/30618330/pexels-photo-30618330.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "art-splash": "https://images.pexels.com/photos/8603638/pexels-photo-8603638.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "tech-setup": "https://images.pexels.com/photos/12877898/pexels-photo-12877898.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
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
      letterSpacing: 0.04,
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
      backgroundImage: PEXELS_IMAGES["whisper"],
      backgroundOpacity: 0.3,
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
      letterSpacing: -0.01,
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
      backgroundImage: PEXELS_IMAGES["monochrome"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.0,
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
      backgroundImage: PEXELS_IMAGES["paper"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.02,
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
      backgroundImage: PEXELS_IMAGES["sunset-gradient"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.01,
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
      backgroundImage: PEXELS_IMAGES["aesthetic-pink"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.0,
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
      backgroundImage: PEXELS_IMAGES["matcha"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.01,
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
      backgroundImage: PEXELS_IMAGES["lavender-dream"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.0,
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
      backgroundImage: PEXELS_IMAGES["ocean-mist"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.08,
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
      backgroundImage: PEXELS_IMAGES["impact"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.06,
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
      backgroundImage: PEXELS_IMAGES["electric"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.02,
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
      backgroundImage: PEXELS_IMAGES["fire"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.1,
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
      backgroundImage: PEXELS_IMAGES["acid"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.0,
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
      backgroundImage: PEXELS_IMAGES["polaroid"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.02,
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
      backgroundImage: PEXELS_IMAGES["typewriter"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.04,
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
      backgroundImage: PEXELS_IMAGES["cinema"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.01,
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
      backgroundImage: PEXELS_IMAGES["sepia"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.0,
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
      backgroundImage: PEXELS_IMAGES["gold-noir"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.06,
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
      backgroundImage: PEXELS_IMAGES["marble"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.02,
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
      backgroundImage: PEXELS_IMAGES["champagne"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.0,
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
      backgroundImage: PEXELS_IMAGES["midnight"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.0,
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
      backgroundImage: PEXELS_IMAGES["marker"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.0,
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
      backgroundImage: PEXELS_IMAGES["bubblegum"],
      backgroundOpacity: 0.3,
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
      letterSpacing: 0.0,
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
      backgroundImage: PEXELS_IMAGES["sunshine"],
      backgroundOpacity: 0.3,
    },
  },

  // ── FOOD ──
  {
    id: "food-rustic",
    name: "Rustic Kitchen",
    category: "food",
    editorState: {
      font: "lora", theme: "cream", fontSize: 1.3, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.7,
      textColor: "#44403c", authorFont: "heading", authorColor: "#78716c", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#f5f0e8", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["food-rustic"], backgroundOpacity: 0.35,
    },
  },

  // ── SPORTS ──
  {
    id: "sports-stadium",
    name: "Stadium Lights",
    category: "sports",
    editorState: {
      font: "bebas", theme: "dark", fontSize: 2.2, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.2,
      textColor: "#ffffff", authorFont: "oswald", authorColor: "#fbbf24", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["sports-stadium"], backgroundOpacity: 0.4,
    },
  },

  // ── HOME ──
  {
    id: "home-cozy",
    name: "Cozy Home",
    category: "home",
    editorState: {
      font: "poppins", theme: "cream", fontSize: 1.3, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.8,
      textColor: "#44403c", authorFont: "raleway", authorColor: "#a8a29e", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#faf7f2", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["home-cozy"], backgroundOpacity: 0.3,
    },
  },

  // ── GARDEN ──
  {
    id: "garden-bloom",
    name: "Garden Bloom",
    category: "garden",
    editorState: {
      font: "dancing", theme: "light", fontSize: 1.6, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#14532d", authorFont: "heading", authorColor: "#15803d", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#ecfdf5", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["garden-bloom"], backgroundOpacity: 0.35,
    },
  },

  // ── CONSTRUCTION ──
  {
    id: "construction-sunset",
    name: "Steel & Sky",
    category: "construction",
    editorState: {
      font: "archivo", theme: "dark", fontSize: 1.6, textAlign: "left", letterSpacing: 0.02, lineHeight: 1.4,
      textColor: "#fbbf24", authorFont: "heading", authorColor: "#f59e0b", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#1c1917", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["construction-sunset"], backgroundOpacity: 0.4,
    },
  },

  // ── AI ──
  {
    id: "ai-neural",
    name: "Neural Net",
    category: "ai",
    editorState: {
      font: "orbitron", theme: "ink", fontSize: 1.2, textAlign: "center", letterSpacing: 0.08, lineHeight: 1.8,
      textColor: "#22d3ee", authorFont: "rajdhani", authorColor: "#06b6d4", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#020617", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["ai-neural"], backgroundOpacity: 0.4,
    },
  },

  // ── FASHION ──
  {
    id: "fashion-silk",
    name: "Silk",
    category: "fashion",
    editorState: {
      font: "playfair", theme: "light", fontSize: 1.4, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#7f1d1d", authorFont: "raleway", authorColor: "#991b1b", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#fff1f2", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["fashion-silk"], backgroundOpacity: 0.3,
    },
  },

  // ── FILM ──
  {
    id: "film-set",
    name: "Director's Cut",
    category: "film",
    editorState: {
      font: "crimson", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.8,
      textColor: "#d4d4d8", authorFont: "heading", authorColor: "#71717a", authorFontSize: 0.75,
      isBold: false, isItalic: true, backgroundColor: "#18181b", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["film-set"], backgroundOpacity: 0.35,
    },
  },

  // ── GAMES ──
  {
    id: "games-arcade",
    name: "Arcade",
    category: "games",
    editorState: {
      font: "audiowide", theme: "ink", fontSize: 1.3, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.6,
      textColor: "#e879f9", authorFont: "rajdhani", authorColor: "#a855f7", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["games-arcade"], backgroundOpacity: 0.4,
    },
  },

  // ── WEATHER ──
  {
    id: "weather-storm",
    name: "Stormy",
    category: "weather",
    editorState: {
      font: "merriweather", theme: "dark", fontSize: 1.3, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.8,
      textColor: "#e2e8f0", authorFont: "heading", authorColor: "#94a3b8", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#1e293b", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["weather-storm"], backgroundOpacity: 0.4,
    },
  },

  // ── TRAVEL ──
  {
    id: "travel-paradise",
    name: "Paradise",
    category: "travel",
    editorState: {
      font: "raleway", theme: "light", fontSize: 1.4, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.7,
      textColor: "#0e7490", authorFont: "heading", authorColor: "#0891b2", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#ecfeff", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["travel-paradise"], backgroundOpacity: 0.35,
    },
  },

  // ── MUSIC ──
  {
    id: "music-stage",
    name: "Live Stage",
    category: "music",
    editorState: {
      font: "bebas", theme: "dark", fontSize: 2.0, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.2,
      textColor: "#f0abfc", authorFont: "mono", authorColor: "#d946ef", authorFontSize: 0.65,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["music-stage"], backgroundOpacity: 0.4,
    },
  },

  // ── FITNESS ──
  {
    id: "fitness-gym",
    name: "Iron Will",
    category: "fitness",
    editorState: {
      font: "oswald", theme: "dark", fontSize: 1.8, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.3,
      textColor: "#ef4444", authorFont: "heading", authorColor: "#dc2626", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["fitness-gym"], backgroundOpacity: 0.35,
    },
  },

  // ── NATURE ──
  {
    id: "nature-peaks",
    name: "Mountain Dawn",
    category: "nature",
    editorState: {
      font: "cormorant", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.7,
      textColor: "#fef3c7", authorFont: "raleway", authorColor: "#fbbf24", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#1e3a5f", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["nature-peaks"], backgroundOpacity: 0.4,
    },
  },

  // ── SPACE ──
  {
    id: "space-nebula",
    name: "Nebula",
    category: "space",
    editorState: {
      font: "orbitron", theme: "ink", fontSize: 1.2, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.8,
      textColor: "#c4b5fd", authorFont: "rajdhani", authorColor: "#8b5cf6", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#0f0720", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["space-nebula"], backgroundOpacity: 0.4,
    },
  },

  // ── COFFEE ──
  {
    id: "coffee-latte",
    name: "Latte Art",
    category: "coffee",
    editorState: {
      font: "satisfy", theme: "cream", fontSize: 1.6, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#44403c", authorFont: "heading", authorColor: "#78716c", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#f5f0e8", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["coffee-latte"], backgroundOpacity: 0.35,
    },
  },

  // ── PETS ──
  {
    id: "pets-golden",
    name: "Good Boy",
    category: "pets",
    editorState: {
      font: "caveat", theme: "cream", fontSize: 1.8, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.4,
      textColor: "#78350f", authorFont: "poppins", authorColor: "#92400e", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#fef3c7", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["pets-golden"], backgroundOpacity: 0.35,
    },
  },

  // ── BOOKS ──
  {
    id: "books-library",
    name: "Library",
    category: "books",
    editorState: {
      font: "merriweather", theme: "cream", fontSize: 1.2, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.9,
      textColor: "#44403c", authorFont: "lora", authorColor: "#78716c", authorFontSize: 0.75,
      isBold: false, isItalic: true, backgroundColor: "#f5f0e8", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["books-library"], backgroundOpacity: 0.35,
    },
  },

  // ── ART ──
  {
    id: "art-splash",
    name: "Paint Splash",
    category: "art",
    editorState: {
      font: "permanent-marker", theme: "light", fontSize: 1.6, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.4,
      textColor: "#1a1a1a", authorFont: "heading", authorColor: "#525252", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#ffffff", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["art-splash"], backgroundOpacity: 0.3,
    },
  },

  // ── TECH ──
  {
    id: "tech-setup",
    name: "Dev Setup",
    category: "tech",
    editorState: {
      font: "mono", theme: "ink", fontSize: 1.1, textAlign: "left", letterSpacing: 0.02, lineHeight: 2.0,
      textColor: "#22d3ee", authorFont: "rajdhani", authorColor: "#06b6d4", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#020617", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["tech-setup"], backgroundOpacity: 0.35,
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
  { value: "food", label: "Food" },
  { value: "sports", label: "Sports" },
  { value: "home", label: "Home" },
  { value: "garden", label: "Garden" },
  { value: "construction", label: "Construction" },
  { value: "ai", label: "AI" },
  { value: "fashion", label: "Fashion" },
  { value: "film", label: "Film" },
  { value: "games", label: "Games" },
  { value: "weather", label: "Weather" },
  { value: "travel", label: "Travel" },
  { value: "music", label: "Music" },
  { value: "fitness", label: "Fitness" },
  { value: "nature", label: "Nature" },
  { value: "space", label: "Space" },
  { value: "coffee", label: "Coffee" },
  { value: "pets", label: "Pets" },
  { value: "books", label: "Books" },
  { value: "art", label: "Art" },
  { value: "tech", label: "Tech" },
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
  "food-rustic": { text: "One cannot think well, love well, sleep well, if one has not dined well.", author: "Virginia Woolf" },
  "sports-stadium": { text: "CHAMPIONS KEEP PLAYING UNTIL THEY GET IT RIGHT.", author: "Billie Jean King" },
  "home-cozy": { text: "There is nothing like staying at home for real comfort.", author: "Jane Austen" },
  "garden-bloom": { text: "In every walk with nature one receives far more than he seeks.", author: "John Muir" },
  "construction-sunset": { text: "WE SHAPE OUR BUILDINGS; THEREAFTER THEY SHAPE US.", author: "Winston Churchill" },
  "ai-neural": { text: "THE MEASURE OF INTELLIGENCE IS THE ABILITY TO CHANGE.", author: "Albert Einstein" },
  "fashion-silk": { text: "Fashion is the armor to survive the reality of everyday life.", author: "Bill Cunningham" },
  "film-set": { text: "Cinema is a matter of what's in the frame and what's out.", author: "Martin Scorsese" },
  "games-arcade": { text: "IN THE GAME OF LIFE, IT'S A GOOD IDEA TO HAVE A FEW EARLY LOSSES.", author: "Walt Disney" },
  "weather-storm": { text: "The fishermen know that the sea is dangerous and the storm terrible, but they have never found these dangers sufficient reason for remaining ashore.", author: "Vincent van Gogh" },
  "travel-paradise": { text: "The world is a book and those who do not travel read only one page.", author: "Augustine of Hippo" },
  "music-stage": { text: "WHERE WORDS FAIL, MUSIC SPEAKS.", author: "Hans Christian Andersen" },
  "fitness-gym": { text: "STRENGTH DOES NOT COME FROM THE BODY. IT COMES FROM THE WILL.", author: "Gandhi" },
  "nature-peaks": { text: "The mountains are calling and I must go.", author: "John Muir" },
  "space-nebula": { text: "SOMEWHERE, SOMETHING INCREDIBLE IS WAITING TO BE KNOWN.", author: "Carl Sagan" },
  "coffee-latte": { text: "But first, coffee.", author: "Anonymous" },
  "pets-golden": { text: "Until one has loved an animal, a part of one's soul remains unawakened.", author: "Anatole France" },
  "books-library": { text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.", author: "George R.R. Martin" },
  "art-splash": { text: "EVERY ARTIST WAS FIRST AN AMATEUR.", author: "Ralph Waldo Emerson" },
  "tech-setup": { text: "any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke" },
};

interface TemplateLibraryProps {
  onApply: (state: Partial<QuoteEditorState>) => void;
  backgroundOpacity: number;
  onOpacityChange: (value: number) => void;
  defaultCategory?: string;
}

export default function TemplateLibrary({ onApply, backgroundOpacity, onOpacityChange, defaultCategory }: TemplateLibraryProps) {
  const [category, setCategory] = useState(defaultCategory || "all");
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

      <div className={category === "all" ? "flex gap-2.5 overflow-x-auto pb-2 scrollbar-none" : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5"}>
        {filtered.map((template) => {
          const s = template.editorState;
          const textCol = s.textColor || "#1a1a1a";
          const fontClass = FONT_CLASS_MAP[s.font || "playfair"] || "font-playfair";
          const quoteData = PREVIEW_QUOTES[template.id];
          const previewText = quoteData?.text || "the quick fox";
          const previewAuthor = quoteData?.author || "";
          const bgImage = PEXELS_IMAGES[template.id];

          return (
            <button
              key={template.id}
              onClick={() => onApply({ ...template.editorState, quote: previewText, authorName: previewAuthor })}
              className={`group relative rounded-xl overflow-hidden border border-border/50 hover:border-foreground/20 transition-all duration-200 hover:shadow-lg hover:scale-[1.03] active:scale-[0.97] ${category === "all" ? "flex-shrink-0" : ""}`}
              style={{ aspectRatio: "3/4", ...(category === "all" ? { width: "140px" } : {}) }}
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

              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 z-10 gap-1">
                <span
                  className={`${fontClass} text-center leading-tight drop-shadow-md`}
                  style={{
                    color: textCol,
                    fontSize: "0.55rem",
                    fontWeight: s.isBold ? "bold" : "normal",
                    fontStyle: s.isItalic ? "italic" : "normal",
                    letterSpacing: s.letterSpacing
                      ? `${Math.min(s.letterSpacing, 2)}px`
                      : undefined,
                    lineHeight: s.lineHeight ? Math.min(s.lineHeight, 1.6) : undefined,
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
                {previewAuthor && (
                  <span
                    className="text-center drop-shadow-md"
                    style={{
                      color: s.authorColor || textCol,
                      fontSize: "0.4rem",
                      opacity: 0.8,
                    }}
                  >
                    — {previewAuthor}
                  </span>
                )}
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

      {/* Opacity slider */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Opacity</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={backgroundOpacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          className="w-1/2 h-1.5 accent-foreground"
        />
        <span className="text-xs text-muted-foreground w-8 text-right">{Math.round(backgroundOpacity * 100)}%</span>
      </div>

      {filtered.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-6">
          No templates in this category yet.
        </p>
      )}
    </div>
  );
}
