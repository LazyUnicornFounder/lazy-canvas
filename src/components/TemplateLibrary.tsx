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
  "cars-supercar": "https://images.pexels.com/photos/12484821/pexels-photo-12484821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "cars-vintage": "https://images.pexels.com/photos/35563087/pexels-photo-35563087.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "cars-racing": "https://images.pexels.com/photos/33148036/pexels-photo-33148036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "crypto-bitcoin": "https://images.pexels.com/photos/4808279/pexels-photo-4808279.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "crypto-blockchain": "https://images.pexels.com/photos/17483849/pexels-photo-17483849.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "crypto-trading": "https://images.pexels.com/photos/17505864/pexels-photo-17505864.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "science-lab": "https://images.pexels.com/photos/7738296/pexels-photo-7738296.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "science-dna": "https://images.pexels.com/photos/25626587/pexels-photo-25626587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "science-chemistry": "https://images.pexels.com/photos/6395524/pexels-photo-6395524.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "architecture-modern": "https://images.pexels.com/photos/34868972/pexels-photo-34868972.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "architecture-classic": "https://images.pexels.com/photos/31718772/pexels-photo-31718772.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "architecture-interior": "https://images.pexels.com/photos/32421762/pexels-photo-32421762.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "education-classroom": "https://images.pexels.com/photos/6602623/pexels-photo-6602623.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "education-books": "https://images.pexels.com/photos/8199252/pexels-photo-8199252.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "education-graduation": "https://images.pexels.com/photos/25643174/pexels-photo-25643174.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "parenting-family": "https://images.pexels.com/photos/3890220/pexels-photo-3890220.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "parenting-baby": "https://images.pexels.com/photos/12654853/pexels-photo-12654853.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "parenting-playground": "https://images.pexels.com/photos/11015643/pexels-photo-11015643.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "real-estate-luxury": "https://images.pexels.com/photos/13203179/pexels-photo-13203179.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "real-estate-city": "https://images.pexels.com/photos/33112743/pexels-photo-33112743.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "real-estate-interior": "https://images.pexels.com/photos/32269122/pexels-photo-32269122.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "wellness-meditation": "https://images.pexels.com/photos/16843771/pexels-photo-16843771.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "wellness-yoga": "https://images.pexels.com/photos/30251338/pexels-photo-30251338.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "wellness-spa": "https://images.pexels.com/photos/6273927/pexels-photo-6273927.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "motivation-summit": "https://images.pexels.com/photos/12909947/pexels-photo-12909947.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "motivation-road": "https://images.pexels.com/photos/27636187/pexels-photo-27636187.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "motivation-hustle": "https://images.pexels.com/photos/57690/pexels-photo-57690.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "business-office": "https://images.pexels.com/photos/32216281/pexels-photo-32216281.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "business-meeting": "https://images.pexels.com/photos/34129728/pexels-photo-34129728.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "business-startup": "https://images.pexels.com/photos/34769279/pexels-photo-34769279.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "photography-portrait": "https://images.pexels.com/photos/18535941/pexels-photo-18535941.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "photography-landscape": "https://images.pexels.com/photos/26872995/pexels-photo-26872995.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "photography-street": "https://images.pexels.com/photos/20598236/pexels-photo-20598236.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "aviation-cockpit": "https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "aviation-sky": "https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "aviation-sunset": "https://images.pexels.com/photos/1089306/pexels-photo-1089306.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "maritime-ocean": "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "maritime-ship": "https://images.pexels.com/photos/813011/pexels-photo-813011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "maritime-lighthouse": "https://images.pexels.com/photos/1532771/pexels-photo-1532771.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "law-justice": "https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "law-gavel": "https://images.pexels.com/photos/5669619/pexels-photo-5669619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "law-books": "https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "baking-bread": "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "baking-pastry": "https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "baking-kitchen": "https://images.pexels.com/photos/3992131/pexels-photo-3992131.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "banking-vault": "https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "banking-finance": "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "banking-coins": "https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "funny-laugh": "https://images.pexels.com/photos/1820559/pexels-photo-1820559.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "funny-silly": "https://images.pexels.com/photos/1683545/pexels-photo-1683545.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "funny-comedy": "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "farming-field": "https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "farming-harvest": "https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "farming-barn": "https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "history-ruins": "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "history-ancient": "https://images.pexels.com/photos/2225442/pexels-photo-2225442.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "history-medieval": "https://images.pexels.com/photos/2611686/pexels-photo-2611686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "autonomy-robot": "https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "autonomy-drone": "https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "autonomy-selfdriving": "https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "minimal-zen": "https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "minimal-air": "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "bold-neon": "https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "retro-vinyl": "https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "elegant-pearl": "https://images.pexels.com/photos/2113566/pexels-photo-2113566.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "playful-doodle": "https://images.pexels.com/photos/5989927/pexels-photo-5989927.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "playful-candy": "https://images.pexels.com/photos/1191639/pexels-photo-1191639.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "food-gourmet": "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "food-fresh": "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "food-spice": "https://images.pexels.com/photos/2454533/pexels-photo-2454533.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "food-sweet": "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "sports-track": "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "sports-court": "https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "sports-swim": "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "sports-climb": "https://images.pexels.com/photos/3077882/pexels-photo-3077882.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "home-modern": "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "home-rustic": "https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "home-garden": "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "home-fireplace": "https://images.pexels.com/photos/5765828/pexels-photo-5765828.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "garden-zen": "https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "garden-wild": "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "garden-herb": "https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "garden-sunset": "https://images.pexels.com/photos/96627/pexels-photo-96627.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "construction-crane": "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "construction-blueprint": "https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "construction-concrete": "https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "construction-tools": "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "ai-circuit": "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "ai-matrix": "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "ai-quantum": "https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "ai-data": "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "fashion-runway": "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "fashion-editorial": "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "fashion-street": "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "fashion-haute": "https://images.pexels.com/photos/3622614/pexels-photo-3622614.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "film-noir": "https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "film-indie": "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "film-action": "https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "film-romance": "https://images.pexels.com/photos/1024981/pexels-photo-1024981.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "games-rpg": "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "games-retro": "https://images.pexels.com/photos/163077/pexels-photo-163077.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "games-strategy": "https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "games-fantasy": "https://images.pexels.com/photos/5765828/pexels-photo-5765828.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "weather-rain": "https://images.pexels.com/photos/1089455/pexels-photo-1089455.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "weather-snow": "https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "weather-fog": "https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "weather-sunny": "https://images.pexels.com/photos/3480494/pexels-photo-3480494.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "travel-mountain": "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "travel-city": "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "travel-desert": "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "travel-beach": "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "music-vinyl": "https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "music-piano": "https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "music-festival": "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "music-jazz": "https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "fitness-run": "https://images.pexels.com/photos/3621183/pexels-photo-3621183.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "fitness-yoga": "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "fitness-box": "https://images.pexels.com/photos/4754146/pexels-photo-4754146.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "fitness-swim": "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "nature-forest": "https://images.pexels.com/photos/338936/pexels-photo-338936.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "nature-ocean": "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "nature-desert": "https://images.pexels.com/photos/1527934/pexels-photo-1527934.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "nature-waterfall": "https://images.pexels.com/photos/358457/pexels-photo-358457.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "space-galaxy": "https://images.pexels.com/photos/2150/pexels-photo-2150.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "space-moon": "https://images.pexels.com/photos/47367/pexels-photo-47367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "space-mars": "https://images.pexels.com/photos/73910/pexels-photo-73910.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "space-astronaut": "https://images.pexels.com/photos/2159/pexels-photo-2159.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "coffee-espresso": "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "coffee-morning": "https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "coffee-brew": "https://images.pexels.com/photos/2074122/pexels-photo-2074122.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "coffee-cozy": "https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "pets-cat": "https://images.pexels.com/photos/45201/pexels-photo-45201.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "pets-puppy": "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "pets-bird": "https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "pets-bunny": "https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "books-novel": "https://images.pexels.com/photos/904616/pexels-photo-904616.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "books-study": "https://images.pexels.com/photos/159711/pexels-photo-159711.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "books-poetry": "https://images.pexels.com/photos/1005012/pexels-photo-1005012.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "books-classic": "https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "art-canvas": "https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "art-graffiti": "https://images.pexels.com/photos/1570779/pexels-photo-1570779.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "art-minimal": "https://images.pexels.com/photos/3004909/pexels-photo-3004909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "art-abstract": "https://images.pexels.com/photos/2693212/pexels-photo-2693212.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "tech-code": "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "tech-minimal": "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "tech-neon": "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "tech-gaming": "https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "cars-classic": "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "cars-drift": "https://images.pexels.com/photos/3136673/pexels-photo-3136673.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "crypto-defi": "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "crypto-nft": "https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "science-space": "https://images.pexels.com/photos/956981/pexels-photo-956981.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "science-micro": "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "architecture-skyline": "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "architecture-minimal": "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "education-chalk": "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "education-science": "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "parenting-reading": "https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "parenting-nature": "https://images.pexels.com/photos/1682497/pexels-photo-1682497.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "real-estate-garden": "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "real-estate-skyline": "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "wellness-nature": "https://images.pexels.com/photos/338936/pexels-photo-338936.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "wellness-journal": "https://images.pexels.com/photos/3759098/pexels-photo-3759098.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "motivation-sunrise": "https://images.pexels.com/photos/1107717/pexels-photo-1107717.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "motivation-lion": "https://images.pexels.com/photos/2220336/pexels-photo-2220336.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "business-skyline": "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "business-laptop": "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "photography-macro": "https://images.pexels.com/photos/1005012/pexels-photo-1005012.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "photography-bw": "https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "aviation-jet": "https://images.pexels.com/photos/2676463/pexels-photo-2676463.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "aviation-clouds": "https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "maritime-port": "https://images.pexels.com/photos/1122462/pexels-photo-1122462.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "maritime-sail": "https://images.pexels.com/photos/163236/pexels-photo-163236.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "law-court": "https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "law-scales": "https://images.pexels.com/photos/5669619/pexels-photo-5669619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "baking-cake": "https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "baking-sourdough": "https://images.pexels.com/photos/5765828/pexels-photo-5765828.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "banking-wall": "https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "banking-gold": "https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "funny-meme": "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "funny-sarcasm": "https://images.pexels.com/photos/1820559/pexels-photo-1820559.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "farming-sunrise": "https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "farming-vineyard": "https://images.pexels.com/photos/442116/pexels-photo-442116.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "history-scroll": "https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "history-map": "https://images.pexels.com/photos/1093673/pexels-photo-1093673.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "autonomy-ai": "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "autonomy-smart": "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
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

  // ── CARS ──
  {
    id: "cars-supercar", name: "Supercar", category: "cars",
    editorState: {
      font: "oswald", theme: "dark", fontSize: 1.8, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.3,
      textColor: "#ef4444", authorFont: "heading", authorColor: "#dc2626", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["cars-supercar"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "cars-vintage", name: "Classic Ride", category: "cars",
    editorState: {
      font: "playfair", theme: "cream", fontSize: 1.4, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#44403c", authorFont: "lora", authorColor: "#78716c", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#f5f0e8", textShadow: "none", backgroundFilter: "vintage", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["cars-vintage"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "cars-racing", name: "Speed", category: "cars",
    editorState: {
      font: "bebas", theme: "dark", fontSize: 2.2, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.1,
      textColor: "#fbbf24", authorFont: "oswald", authorColor: "#f59e0b", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["cars-racing"], backgroundOpacity: 0.4,
    },
  },

  // ── CRYPTO ──
  {
    id: "crypto-bitcoin", name: "Bitcoin", category: "crypto",
    editorState: {
      font: "orbitron", theme: "dark", fontSize: 1.2, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.8,
      textColor: "#f59e0b", authorFont: "rajdhani", authorColor: "#d97706", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["crypto-bitcoin"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "crypto-blockchain", name: "Blockchain", category: "crypto",
    editorState: {
      font: "rajdhani", theme: "ink", fontSize: 1.4, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.6,
      textColor: "#22d3ee", authorFont: "mono", authorColor: "#06b6d4", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#020617", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["crypto-blockchain"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "crypto-trading", name: "Trading", category: "crypto",
    editorState: {
      font: "mono", theme: "dark", fontSize: 1.1, textAlign: "left", letterSpacing: 0.02, lineHeight: 2.0,
      textColor: "#4ade80", authorFont: "rajdhani", authorColor: "#22c55e", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["crypto-trading"], backgroundOpacity: 0.35,
    },
  },

  // ── SCIENCE ──
  {
    id: "science-lab", name: "Lab", category: "science",
    editorState: {
      font: "inter", theme: "light", fontSize: 1.2, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.8,
      textColor: "#1e3a5f", authorFont: "heading", authorColor: "#3b82f6", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#f0f9ff", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["science-lab"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "science-dna", name: "DNA", category: "science",
    editorState: {
      font: "montserrat", theme: "dark", fontSize: 1.3, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.7,
      textColor: "#a78bfa", authorFont: "heading", authorColor: "#8b5cf6", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#0f0720", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["science-dna"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "science-chemistry", name: "Chemistry", category: "science",
    editorState: {
      font: "inter", theme: "light", fontSize: 1.3, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.8,
      textColor: "#0e7490", authorFont: "heading", authorColor: "#0891b2", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#ecfeff", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["science-chemistry"], backgroundOpacity: 0.3,
    },
  },

  // ── ARCHITECTURE ──
  {
    id: "architecture-modern", name: "Modern", category: "architecture",
    editorState: {
      font: "heading", theme: "light", fontSize: 1.4, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.6,
      textColor: "#1c1917", authorFont: "raleway", authorColor: "#78716c", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#f5f5f4", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["architecture-modern"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "architecture-classic", name: "Classical", category: "architecture",
    editorState: {
      font: "cormorant", theme: "cream", fontSize: 1.6, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.7,
      textColor: "#44403c", authorFont: "heading", authorColor: "#78716c", authorFontSize: 0.65,
      isBold: false, isItalic: true, backgroundColor: "#f5f0e8", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["architecture-classic"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "architecture-interior", name: "Interior", category: "architecture",
    editorState: {
      font: "raleway", theme: "light", fontSize: 1.3, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.8,
      textColor: "#292524", authorFont: "heading", authorColor: "#a8a29e", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#fafaf9", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["architecture-interior"], backgroundOpacity: 0.3,
    },
  },

  // ── EDUCATION ──
  {
    id: "education-classroom", name: "Classroom", category: "education",
    editorState: {
      font: "poppins", theme: "light", fontSize: 1.3, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.8,
      textColor: "#1e40af", authorFont: "heading", authorColor: "#3b82f6", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#eff6ff", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["education-classroom"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "education-books", name: "Study", category: "education",
    editorState: {
      font: "merriweather", theme: "cream", fontSize: 1.2, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.9,
      textColor: "#44403c", authorFont: "lora", authorColor: "#78716c", authorFontSize: 0.75,
      isBold: false, isItalic: true, backgroundColor: "#f5f0e8", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["education-books"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "education-graduation", name: "Graduation", category: "education",
    editorState: {
      font: "playfair", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#fef3c7", authorFont: "raleway", authorColor: "#fbbf24", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#1e3a5f", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["education-graduation"], backgroundOpacity: 0.4,
    },
  },

  // ── PARENTING ──
  {
    id: "parenting-family", name: "Family", category: "parenting",
    editorState: {
      font: "poppins", theme: "light", fontSize: 1.3, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.8,
      textColor: "#831843", authorFont: "heading", authorColor: "#be185d", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#fdf2f8", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["parenting-family"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "parenting-baby", name: "Little One", category: "parenting",
    editorState: {
      font: "caveat", theme: "light", fontSize: 1.8, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.4,
      textColor: "#78350f", authorFont: "poppins", authorColor: "#92400e", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#fef3c7", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["parenting-baby"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "parenting-playground", name: "Playground", category: "parenting",
    editorState: {
      font: "satisfy", theme: "light", fontSize: 1.6, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#15803d", authorFont: "heading", authorColor: "#22c55e", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#ecfdf5", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["parenting-playground"], backgroundOpacity: 0.35,
    },
  },

  // ── REAL ESTATE ──
  {
    id: "real-estate-luxury", name: "Luxury Home", category: "real-estate",
    editorState: {
      font: "playfair", theme: "light", fontSize: 1.4, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#78350f", authorFont: "raleway", authorColor: "#92400e", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#fef3c7", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["real-estate-luxury"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "real-estate-city", name: "City View", category: "real-estate",
    editorState: {
      font: "heading", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.4,
      textColor: "#e2e8f0", authorFont: "montserrat", authorColor: "#94a3b8", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0f172a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["real-estate-city"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "real-estate-interior", name: "Dream Home", category: "real-estate",
    editorState: {
      font: "raleway", theme: "light", fontSize: 1.3, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.8,
      textColor: "#292524", authorFont: "heading", authorColor: "#a8a29e", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#fafaf9", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["real-estate-interior"], backgroundOpacity: 0.3,
    },
  },

  // ── WELLNESS ──
  {
    id: "wellness-meditation", name: "Meditation", category: "wellness",
    editorState: {
      font: "cormorant", theme: "light", fontSize: 1.5, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.8,
      textColor: "#14532d", authorFont: "heading", authorColor: "#15803d", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#ecfdf5", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["wellness-meditation"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "wellness-yoga", name: "Yoga", category: "wellness",
    editorState: {
      font: "lora", theme: "cream", fontSize: 1.4, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.7,
      textColor: "#78350f", authorFont: "raleway", authorColor: "#92400e", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#fef3c7", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["wellness-yoga"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "wellness-spa", name: "Spa", category: "wellness",
    editorState: {
      font: "dancing", theme: "light", fontSize: 1.6, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#581c87", authorFont: "montserrat", authorColor: "#7e22ce", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#f3e8ff", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["wellness-spa"], backgroundOpacity: 0.3,
    },
  },

  // ── MOTIVATION ──
  {
    id: "motivation-summit", name: "Summit", category: "motivation",
    editorState: {
      font: "oswald", theme: "dark", fontSize: 1.8, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.3,
      textColor: "#fef3c7", authorFont: "heading", authorColor: "#fbbf24", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#1e3a5f", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["motivation-summit"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "motivation-road", name: "The Road", category: "motivation",
    editorState: {
      font: "raleway", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#e2e8f0", authorFont: "heading", authorColor: "#94a3b8", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#0f172a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["motivation-road"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "motivation-hustle", name: "Hustle", category: "motivation",
    editorState: {
      font: "archivo", theme: "dark", fontSize: 1.6, textAlign: "left", letterSpacing: 0.02, lineHeight: 1.4,
      textColor: "#ffffff", authorFont: "heading", authorColor: "#737373", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["motivation-hustle"], backgroundOpacity: 0.35,
    },
  },

  // ── BUSINESS ──
  {
    id: "business-office", name: "Office", category: "business",
    editorState: {
      font: "inter", theme: "light", fontSize: 1.2, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.8,
      textColor: "#1e293b", authorFont: "heading", authorColor: "#64748b", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#f8fafc", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["business-office"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "business-meeting", name: "Corporate", category: "business",
    editorState: {
      font: "heading", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.6,
      textColor: "#e2e8f0", authorFont: "montserrat", authorColor: "#94a3b8", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#0f172a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["business-meeting"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "business-startup", name: "Startup", category: "business",
    editorState: {
      font: "inter", theme: "light", fontSize: 1.3, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.8,
      textColor: "#7c3aed", authorFont: "heading", authorColor: "#8b5cf6", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#f5f3ff", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["business-startup"], backgroundOpacity: 0.3,
    },
  },

  // ── PHOTOGRAPHY ──
  {
    id: "photography-portrait", name: "Portrait", category: "photography",
    editorState: {
      font: "playfair", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#d4d4d8", authorFont: "raleway", authorColor: "#71717a", authorFontSize: 0.75,
      isBold: false, isItalic: true, backgroundColor: "#18181b", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["photography-portrait"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "photography-landscape", name: "Landscape", category: "photography",
    editorState: {
      font: "cormorant", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.7,
      textColor: "#fef3c7", authorFont: "heading", authorColor: "#fbbf24", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#1e3a5f", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["photography-landscape"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "photography-street", name: "Street", category: "photography",
    editorState: {
      font: "mono", theme: "dark", fontSize: 1.1, textAlign: "left", letterSpacing: 0.02, lineHeight: 2.0,
      textColor: "#e2e8f0", authorFont: "heading", authorColor: "#94a3b8", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["photography-street"], backgroundOpacity: 0.4,
    },
  },

  // ── AVIATION ──
  {
    id: "aviation-cockpit", name: "Cockpit", category: "aviation",
    editorState: {
      font: "orbitron", theme: "dark", fontSize: 1.1, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.9,
      textColor: "#38bdf8", authorFont: "heading", authorColor: "#7dd3fc", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0c1222", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["aviation-cockpit"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "aviation-sky", name: "Sky High", category: "aviation",
    editorState: {
      font: "bebas", theme: "light", fontSize: 1.8, textAlign: "center", letterSpacing: 0.08, lineHeight: 1.5,
      textColor: "#ffffff", authorFont: "raleway", authorColor: "#e0f2fe", authorFontSize: 0.75,
      isBold: false, isItalic: false, backgroundColor: "#1e40af", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["aviation-sky"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "aviation-sunset", name: "Horizon", category: "aviation",
    editorState: {
      font: "playfair", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#fef3c7", authorFont: "heading", authorColor: "#fbbf24", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#1a1a2e", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["aviation-sunset"], backgroundOpacity: 0.4,
    },
  },

  // ── MARITIME ──
  {
    id: "maritime-ocean", name: "Deep Blue", category: "maritime",
    editorState: {
      font: "cormorant", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#bae6fd", authorFont: "heading", authorColor: "#7dd3fc", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#0a1628", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["maritime-ocean"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "maritime-ship", name: "Voyage", category: "maritime",
    editorState: {
      font: "bebas", theme: "dark", fontSize: 1.8, textAlign: "center", letterSpacing: 0.1, lineHeight: 1.4,
      textColor: "#ffffff", authorFont: "raleway", authorColor: "#94a3b8", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#0f172a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["maritime-ship"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "maritime-lighthouse", name: "Lighthouse", category: "maritime",
    editorState: {
      font: "lora", theme: "dark", fontSize: 1.3, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.8,
      textColor: "#fef9c3", authorFont: "heading", authorColor: "#fde68a", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#1c1917", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["maritime-lighthouse"], backgroundOpacity: 0.4,
    },
  },

  // ── LAW ──
  {
    id: "law-justice", name: "Justice", category: "law",
    editorState: {
      font: "playfair", theme: "dark", fontSize: 1.3, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.8,
      textColor: "#d4af37", authorFont: "heading", authorColor: "#b8860b", authorFontSize: 0.75,
      isBold: false, isItalic: true, backgroundColor: "#1a1a1a", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["law-justice"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "law-gavel", name: "Gavel", category: "law",
    editorState: {
      font: "cormorant", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.7,
      textColor: "#e2e8f0", authorFont: "raleway", authorColor: "#94a3b8", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#27272a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["law-gavel"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "law-books", name: "Statute", category: "law",
    editorState: {
      font: "merriweather", theme: "dark", fontSize: 1.2, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.9,
      textColor: "#fef3c7", authorFont: "heading", authorColor: "#d97706", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#292524", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["law-books"], backgroundOpacity: 0.35,
    },
  },

  // ── BAKING ──
  {
    id: "baking-bread", name: "Artisan", category: "baking",
    editorState: {
      font: "caveat", theme: "light", fontSize: 1.6, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#78350f", authorFont: "heading", authorColor: "#92400e", authorFontSize: 0.75,
      isBold: false, isItalic: false, backgroundColor: "#fef3c7", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["baking-bread"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "baking-pastry", name: "Pastry", category: "baking",
    editorState: {
      font: "dancing", theme: "light", fontSize: 1.5, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.6,
      textColor: "#be185d", authorFont: "raleway", authorColor: "#9d174d", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#fff1f2", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["baking-pastry"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "baking-kitchen", name: "Kitchen", category: "baking",
    editorState: {
      font: "lora", theme: "light", fontSize: 1.3, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.8,
      textColor: "#451a03", authorFont: "heading", authorColor: "#78350f", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#fffbeb", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["baking-kitchen"], backgroundOpacity: 0.3,
    },
  },

  // ── BANKING ──
  {
    id: "banking-vault", name: "Vault", category: "banking",
    editorState: {
      font: "oswald", theme: "dark", fontSize: 1.3, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.7,
      textColor: "#d4af37", authorFont: "heading", authorColor: "#b8860b", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["banking-vault"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "banking-finance", name: "Finance", category: "banking",
    editorState: {
      font: "inter", theme: "dark", fontSize: 1.2, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.9,
      textColor: "#22c55e", authorFont: "raleway", authorColor: "#4ade80", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#0f172a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["banking-finance"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "banking-coins", name: "Wealth", category: "banking",
    editorState: {
      font: "playfair", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#fef3c7", authorFont: "heading", authorColor: "#fbbf24", authorFontSize: 0.75,
      isBold: false, isItalic: true, backgroundColor: "#1c1917", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["banking-coins"], backgroundOpacity: 0.35,
    },
  },

  // ── FUNNY ──
  {
    id: "funny-laugh", name: "LOL", category: "funny",
    editorState: {
      font: "permanent-marker", theme: "light", fontSize: 1.5, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.6,
      textColor: "#dc2626", authorFont: "heading", authorColor: "#ef4444", authorFontSize: 0.75,
      isBold: false, isItalic: false, backgroundColor: "#fef9c3", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["funny-laugh"], backgroundOpacity: 0.25,
    },
  },
  {
    id: "funny-silly", name: "Silly", category: "funny",
    editorState: {
      font: "caveat", theme: "light", fontSize: 1.6, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#7c3aed", authorFont: "raleway", authorColor: "#8b5cf6", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#fef3c7", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["funny-silly"], backgroundOpacity: 0.25,
    },
  },
  {
    id: "funny-comedy", name: "Comedy", category: "funny",
    editorState: {
      font: "archivo", theme: "dark", fontSize: 1.3, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.7,
      textColor: "#fbbf24", authorFont: "heading", authorColor: "#f59e0b", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#18181b", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["funny-comedy"], backgroundOpacity: 0.3,
    },
  },

  // ── FARMING ──
  {
    id: "farming-field", name: "Golden Field", category: "farming",
    editorState: {
      font: "lora", theme: "light", fontSize: 1.4, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.7,
      textColor: "#365314", authorFont: "heading", authorColor: "#4d7c0f", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#fefce8", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["farming-field"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "farming-harvest", name: "Harvest", category: "farming",
    editorState: {
      font: "merriweather", theme: "light", fontSize: 1.2, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.9,
      textColor: "#78350f", authorFont: "raleway", authorColor: "#92400e", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#fffbeb", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["farming-harvest"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "farming-barn", name: "Barn", category: "farming",
    editorState: {
      font: "caveat", theme: "dark", fontSize: 1.6, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#fef3c7", authorFont: "heading", authorColor: "#fde68a", authorFontSize: 0.75,
      isBold: false, isItalic: false, backgroundColor: "#292524", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["farming-barn"], backgroundOpacity: 0.4,
    },
  },

  // ── HISTORY ──
  {
    id: "history-ruins", name: "Ruins", category: "history",
    editorState: {
      font: "cormorant", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#d4af37", authorFont: "heading", authorColor: "#b8860b", authorFontSize: 0.75,
      isBold: false, isItalic: true, backgroundColor: "#1c1917", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["history-ruins"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "history-ancient", name: "Ancient", category: "history",
    editorState: {
      font: "playfair", theme: "dark", fontSize: 1.3, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.8,
      textColor: "#fef3c7", authorFont: "raleway", authorColor: "#fbbf24", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#292524", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["history-ancient"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "history-medieval", name: "Medieval", category: "history",
    editorState: {
      font: "merriweather", theme: "dark", fontSize: 1.2, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.9,
      textColor: "#e2e8f0", authorFont: "heading", authorColor: "#94a3b8", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#1a1a2e", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["history-medieval"], backgroundOpacity: 0.35,
    },
  },

  // ── AUTONOMY ──
  {
    id: "autonomy-robot", name: "Robot", category: "autonomy",
    editorState: {
      font: "orbitron", theme: "dark", fontSize: 1.1, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.9,
      textColor: "#22d3ee", authorFont: "heading", authorColor: "#67e8f9", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["autonomy-robot"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "autonomy-drone", name: "Drone", category: "autonomy",
    editorState: {
      font: "rajdhani", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.6,
      textColor: "#a5f3fc", authorFont: "raleway", authorColor: "#67e8f9", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0c4a6e", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["autonomy-drone"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "autonomy-selfdriving", name: "Self-Driving", category: "autonomy",
    editorState: {
      font: "audiowide", theme: "dark", fontSize: 1.1, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.8,
      textColor: "#e0f2fe", authorFont: "heading", authorColor: "#7dd3fc", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#0f172a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["autonomy-selfdriving"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "minimal-zen", name: "Zen", category: "minimal",
    editorState: {
      font: "inter", theme: "light", fontSize: 1.1, textAlign: "center", letterSpacing: 0.06, lineHeight: 2.4,
      textColor: "#a1a1aa", authorFont: "inter", authorColor: "#d4d4d8", authorFontSize: 0.6,
      isBold: false, isItalic: false, backgroundColor: "#fafafa", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["minimal-zen"], backgroundOpacity: 0.25,
    },
  },
  {
    id: "minimal-air", name: "Air", category: "minimal",
    editorState: {
      font: "inter", theme: "light", fontSize: 1.3, textAlign: "center", letterSpacing: 0.02, lineHeight: 2.0,
      textColor: "#71717a", authorFont: "heading", authorColor: "#a1a1aa", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#ffffff", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["minimal-air"], backgroundOpacity: 0.2,
    },
  },
  {
    id: "bold-neon", name: "Neon", category: "bold",
    editorState: {
      font: "audiowide", theme: "ink", fontSize: 1.4, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.5,
      textColor: "#f43f5e", authorFont: "rajdhani", authorColor: "#fb7185", authorFontSize: 0.65,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["bold-neon"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "retro-vinyl", name: "Vinyl", category: "retro",
    editorState: {
      font: "permanent-marker", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#fef3c7", authorFont: "caveat", authorColor: "#fbbf24", authorFontSize: 0.8,
      isBold: false, isItalic: false, backgroundColor: "#292524", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["retro-vinyl"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "elegant-pearl", name: "Pearl", category: "elegant",
    editorState: {
      font: "lora", theme: "light", fontSize: 1.3, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.8,
      textColor: "#44403c", authorFont: "raleway", authorColor: "#78716c", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#f5f5f0", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["elegant-pearl"], backgroundOpacity: 0.25,
    },
  },
  {
    id: "playful-doodle", name: "Doodle", category: "playful",
    editorState: {
      font: "shadows-into-light", theme: "light", fontSize: 1.5, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#2563eb", authorFont: "caveat", authorColor: "#3b82f6", authorFontSize: 0.8,
      isBold: false, isItalic: false, backgroundColor: "#eff6ff", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["playful-doodle"], backgroundOpacity: 0.25,
    },
  },
  {
    id: "playful-candy", name: "Candy", category: "playful",
    editorState: {
      font: "pacifico", theme: "light", fontSize: 1.4, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.6,
      textColor: "#db2777", authorFont: "poppins", authorColor: "#ec4899", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#fdf2f8", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["playful-candy"], backgroundOpacity: 0.25,
    },
  },
  {
    id: "food-gourmet", name: "Gourmet", category: "food",
    editorState: {
      font: "playfair", theme: "dark", fontSize: 1.3, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#fef3c7", authorFont: "heading", authorColor: "#fbbf24", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#1c1917", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["food-gourmet"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "food-fresh", name: "Farm Fresh", category: "food",
    editorState: {
      font: "caveat", theme: "light", fontSize: 1.5, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#365314", authorFont: "heading", authorColor: "#4d7c0f", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#f7fee7", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["food-fresh"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "food-spice", name: "Spice", category: "food",
    editorState: {
      font: "oswald", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.5,
      textColor: "#ef4444", authorFont: "heading", authorColor: "#dc2626", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#1a1a1a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["food-spice"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "food-sweet", name: "Sweet Tooth", category: "food",
    editorState: {
      font: "dancing", theme: "light", fontSize: 1.5, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.6,
      textColor: "#be185d", authorFont: "raleway", authorColor: "#9d174d", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#fff1f2", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["food-sweet"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "sports-track", name: "Track", category: "sports",
    editorState: {
      font: "oswald", theme: "dark", fontSize: 1.6, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.3,
      textColor: "#22c55e", authorFont: "heading", authorColor: "#16a34a", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["sports-track"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "sports-court", name: "Court", category: "sports",
    editorState: {
      font: "archivo", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.4,
      textColor: "#f97316", authorFont: "heading", authorColor: "#ea580c", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#1c1917", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["sports-court"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "sports-swim", name: "Swim", category: "sports",
    editorState: {
      font: "bebas", theme: "dark", fontSize: 2.0, textAlign: "center", letterSpacing: 0.08, lineHeight: 1.2,
      textColor: "#38bdf8", authorFont: "raleway", authorColor: "#0ea5e9", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#0c4a6e", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["sports-swim"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "sports-climb", name: "Summit", category: "sports",
    editorState: {
      font: "montserrat", theme: "dark", fontSize: 1.3, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#e2e8f0", authorFont: "heading", authorColor: "#94a3b8", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#1e293b", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["sports-climb"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "home-modern", name: "Modern", category: "home",
    editorState: {
      font: "inter", theme: "light", fontSize: 1.2, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.9,
      textColor: "#374151", authorFont: "heading", authorColor: "#6b7280", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#f9fafb", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["home-modern"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "home-rustic", name: "Rustic", category: "home",
    editorState: {
      font: "lora", theme: "cream", fontSize: 1.3, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.8,
      textColor: "#78350f", authorFont: "heading", authorColor: "#92400e", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#fffbeb", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["home-rustic"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "home-garden", name: "Patio", category: "home",
    editorState: {
      font: "caveat", theme: "light", fontSize: 1.5, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#14532d", authorFont: "heading", authorColor: "#15803d", authorFontSize: 0.75,
      isBold: false, isItalic: false, backgroundColor: "#f0fdf4", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["home-garden"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "home-fireplace", name: "Fireside", category: "home",
    editorState: {
      font: "merriweather", theme: "dark", fontSize: 1.2, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.9,
      textColor: "#fef3c7", authorFont: "heading", authorColor: "#fde68a", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#292524", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["home-fireplace"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "garden-zen", name: "Zen Garden", category: "garden",
    editorState: {
      font: "inter", theme: "light", fontSize: 1.2, textAlign: "center", letterSpacing: 0.04, lineHeight: 2.0,
      textColor: "#4b5563", authorFont: "heading", authorColor: "#6b7280", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#f9fafb", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["garden-zen"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "garden-wild", name: "Wildflower", category: "garden",
    editorState: {
      font: "caveat", theme: "light", fontSize: 1.6, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.4,
      textColor: "#be185d", authorFont: "heading", authorColor: "#db2777", authorFontSize: 0.75,
      isBold: false, isItalic: false, backgroundColor: "#fdf2f8", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["garden-wild"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "garden-herb", name: "Herb", category: "garden",
    editorState: {
      font: "lora", theme: "cream", fontSize: 1.3, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.8,
      textColor: "#365314", authorFont: "heading", authorColor: "#4d7c0f", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#f7fee7", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["garden-herb"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "garden-sunset", name: "Twilight", category: "garden",
    editorState: {
      font: "playfair", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#fbbf24", authorFont: "heading", authorColor: "#f59e0b", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#1c1917", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["garden-sunset"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "construction-crane", name: "Crane", category: "construction",
    editorState: {
      font: "bebas", theme: "dark", fontSize: 2.0, textAlign: "center", letterSpacing: 0.08, lineHeight: 1.2,
      textColor: "#f97316", authorFont: "heading", authorColor: "#ea580c", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["construction-crane"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "construction-blueprint", name: "Blueprint", category: "construction",
    editorState: {
      font: "mono", theme: "dark", fontSize: 1.1, textAlign: "left", letterSpacing: 0.04, lineHeight: 2.0,
      textColor: "#60a5fa", authorFont: "heading", authorColor: "#3b82f6", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#0f172a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["construction-blueprint"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "construction-concrete", name: "Concrete", category: "construction",
    editorState: {
      font: "oswald", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.4,
      textColor: "#e2e8f0", authorFont: "heading", authorColor: "#94a3b8", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#1e293b", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["construction-concrete"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "construction-tools", name: "Workshop", category: "construction",
    editorState: {
      font: "archivo", theme: "dark", fontSize: 1.3, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.6,
      textColor: "#fbbf24", authorFont: "heading", authorColor: "#f59e0b", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#292524", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["construction-tools"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "ai-circuit", name: "Circuit", category: "ai",
    editorState: {
      font: "rajdhani", theme: "ink", fontSize: 1.3, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.7,
      textColor: "#a5f3fc", authorFont: "heading", authorColor: "#22d3ee", authorFontSize: 0.65,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["ai-circuit"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "ai-matrix", name: "Matrix", category: "ai",
    editorState: {
      font: "mono", theme: "ink", fontSize: 1.0, textAlign: "left", letterSpacing: 0.02, lineHeight: 2.2,
      textColor: "#4ade80", authorFont: "heading", authorColor: "#22c55e", authorFontSize: 0.6,
      isBold: false, isItalic: false, backgroundColor: "#020617", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["ai-matrix"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "ai-quantum", name: "Quantum", category: "ai",
    editorState: {
      font: "audiowide", theme: "dark", fontSize: 1.1, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.8,
      textColor: "#818cf8", authorFont: "heading", authorColor: "#6366f1", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#0f0720", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["ai-quantum"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "ai-data", name: "Data Flow", category: "ai",
    editorState: {
      font: "rajdhani", theme: "ink", fontSize: 1.2, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.9,
      textColor: "#f472b6", authorFont: "heading", authorColor: "#ec4899", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["ai-data"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "fashion-runway", name: "Runway", category: "fashion",
    editorState: {
      font: "oswald", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.4,
      textColor: "#ffffff", authorFont: "heading", authorColor: "#a1a1aa", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["fashion-runway"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "fashion-editorial", name: "Editorial", category: "fashion",
    editorState: {
      font: "cormorant", theme: "light", fontSize: 1.5, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#1c1917", authorFont: "raleway", authorColor: "#57534e", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#fafaf9", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["fashion-editorial"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "fashion-street", name: "Street Style", category: "fashion",
    editorState: {
      font: "archivo", theme: "dark", fontSize: 1.3, textAlign: "left", letterSpacing: 0.02, lineHeight: 1.6,
      textColor: "#e2e8f0", authorFont: "heading", authorColor: "#94a3b8", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#18181b", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["fashion-street"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "fashion-haute", name: "Haute", category: "fashion",
    editorState: {
      font: "great-vibes", theme: "dark", fontSize: 1.8, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#d4af37", authorFont: "raleway", authorColor: "#b8860b", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#0c0a09", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["fashion-haute"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "film-noir", name: "Film Noir", category: "film",
    editorState: {
      font: "playfair", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#d4d4d8", authorFont: "heading", authorColor: "#71717a", authorFontSize: 0.75,
      isBold: false, isItalic: true, backgroundColor: "#0a0a0a", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["film-noir"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "film-indie", name: "Indie", category: "film",
    editorState: {
      font: "caveat", theme: "cream", fontSize: 1.6, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#44403c", authorFont: "heading", authorColor: "#78716c", authorFontSize: 0.75,
      isBold: false, isItalic: false, backgroundColor: "#f5f0e8", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["film-indie"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "film-action", name: "Action", category: "film",
    editorState: {
      font: "bebas", theme: "dark", fontSize: 2.2, textAlign: "center", letterSpacing: 0.08, lineHeight: 1.1,
      textColor: "#ef4444", authorFont: "oswald", authorColor: "#dc2626", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["film-action"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "film-romance", name: "Romance", category: "film",
    editorState: {
      font: "dancing", theme: "light", fontSize: 1.6, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#be185d", authorFont: "raleway", authorColor: "#9d174d", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#fff1f2", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["film-romance"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "games-rpg", name: "RPG", category: "games",
    editorState: {
      font: "orbitron", theme: "ink", fontSize: 1.1, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.8,
      textColor: "#fbbf24", authorFont: "rajdhani", authorColor: "#f59e0b", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["games-rpg"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "games-retro", name: "8-Bit", category: "games",
    editorState: {
      font: "mono", theme: "ink", fontSize: 1.0, textAlign: "center", letterSpacing: 0.04, lineHeight: 2.0,
      textColor: "#4ade80", authorFont: "heading", authorColor: "#22c55e", authorFontSize: 0.6,
      isBold: false, isItalic: false, backgroundColor: "#020617", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["games-retro"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "games-strategy", name: "Strategy", category: "games",
    editorState: {
      font: "rajdhani", theme: "dark", fontSize: 1.3, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.7,
      textColor: "#38bdf8", authorFont: "heading", authorColor: "#0ea5e9", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0f172a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["games-strategy"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "games-fantasy", name: "Fantasy", category: "games",
    editorState: {
      font: "great-vibes", theme: "dark", fontSize: 1.8, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#c4b5fd", authorFont: "heading", authorColor: "#8b5cf6", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#1a1a2e", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["games-fantasy"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "weather-rain", name: "Rainy Day", category: "weather",
    editorState: {
      font: "lora", theme: "dark", fontSize: 1.3, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.8,
      textColor: "#93c5fd", authorFont: "heading", authorColor: "#60a5fa", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#1e3a5f", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["weather-rain"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "weather-snow", name: "Snowfall", category: "weather",
    editorState: {
      font: "cormorant", theme: "light", fontSize: 1.5, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#1e293b", authorFont: "heading", authorColor: "#475569", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#f1f5f9", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["weather-snow"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "weather-fog", name: "Misty", category: "weather",
    editorState: {
      font: "inter", theme: "dark", fontSize: 1.2, textAlign: "center", letterSpacing: 0.04, lineHeight: 2.0,
      textColor: "#94a3b8", authorFont: "heading", authorColor: "#64748b", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#1e293b", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["weather-fog"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "weather-sunny", name: "Sunshine", category: "weather",
    editorState: {
      font: "poppins", theme: "light", fontSize: 1.3, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.8,
      textColor: "#b45309", authorFont: "heading", authorColor: "#d97706", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#fffbeb", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["weather-sunny"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "travel-mountain", name: "Alpine", category: "travel",
    editorState: {
      font: "bebas", theme: "dark", fontSize: 1.8, textAlign: "center", letterSpacing: 0.08, lineHeight: 1.3,
      textColor: "#ffffff", authorFont: "raleway", authorColor: "#e2e8f0", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#1e293b", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["travel-mountain"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "travel-city", name: "Urban", category: "travel",
    editorState: {
      font: "archivo", theme: "dark", fontSize: 1.3, textAlign: "left", letterSpacing: 0.02, lineHeight: 1.6,
      textColor: "#e2e8f0", authorFont: "heading", authorColor: "#94a3b8", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#18181b", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["travel-city"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "travel-desert", name: "Desert", category: "travel",
    editorState: {
      font: "oswald", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.4,
      textColor: "#fbbf24", authorFont: "heading", authorColor: "#f59e0b", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#292524", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["travel-desert"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "travel-beach", name: "Coastal", category: "travel",
    editorState: {
      font: "satisfy", theme: "light", fontSize: 1.6, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#0e7490", authorFont: "heading", authorColor: "#0891b2", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#ecfeff", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["travel-beach"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "music-vinyl", name: "Vinyl", category: "music",
    editorState: {
      font: "permanent-marker", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#fef3c7", authorFont: "caveat", authorColor: "#fbbf24", authorFontSize: 0.8,
      isBold: false, isItalic: false, backgroundColor: "#292524", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["music-vinyl"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "music-piano", name: "Piano", category: "music",
    editorState: {
      font: "playfair", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#e2e8f0", authorFont: "heading", authorColor: "#94a3b8", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#0f172a", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["music-piano"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "music-festival", name: "Festival", category: "music",
    editorState: {
      font: "audiowide", theme: "dark", fontSize: 1.2, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.7,
      textColor: "#e879f9", authorFont: "heading", authorColor: "#d946ef", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["music-festival"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "music-jazz", name: "Jazz", category: "music",
    editorState: {
      font: "great-vibes", theme: "dark", fontSize: 1.8, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#d4af37", authorFont: "raleway", authorColor: "#b8860b", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#0c0a09", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["music-jazz"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "fitness-run", name: "Runner", category: "fitness",
    editorState: {
      font: "bebas", theme: "dark", fontSize: 2.0, textAlign: "center", letterSpacing: 0.08, lineHeight: 1.2,
      textColor: "#22c55e", authorFont: "heading", authorColor: "#16a34a", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["fitness-run"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "fitness-yoga", name: "Flow", category: "fitness",
    editorState: {
      font: "dancing", theme: "light", fontSize: 1.5, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.6,
      textColor: "#7c3aed", authorFont: "heading", authorColor: "#8b5cf6", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#f5f3ff", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["fitness-yoga"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "fitness-box", name: "Boxing", category: "fitness",
    editorState: {
      font: "archivo", theme: "dark", fontSize: 1.5, textAlign: "left", letterSpacing: 0.02, lineHeight: 1.4,
      textColor: "#ef4444", authorFont: "heading", authorColor: "#dc2626", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#1c1917", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["fitness-box"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "fitness-swim", name: "Swim", category: "fitness",
    editorState: {
      font: "oswald", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.5,
      textColor: "#38bdf8", authorFont: "heading", authorColor: "#0ea5e9", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0c4a6e", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["fitness-swim"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "nature-forest", name: "Forest", category: "nature",
    editorState: {
      font: "lora", theme: "dark", fontSize: 1.3, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.8,
      textColor: "#86efac", authorFont: "heading", authorColor: "#4ade80", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#052e16", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["nature-forest"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "nature-ocean", name: "Oceanic", category: "nature",
    editorState: {
      font: "cormorant", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#bae6fd", authorFont: "heading", authorColor: "#7dd3fc", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#0a1628", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["nature-ocean"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "nature-desert", name: "Dune", category: "nature",
    editorState: {
      font: "oswald", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.4,
      textColor: "#fbbf24", authorFont: "heading", authorColor: "#f59e0b", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#292524", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["nature-desert"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "nature-waterfall", name: "Cascade", category: "nature",
    editorState: {
      font: "playfair", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#e0f2fe", authorFont: "heading", authorColor: "#38bdf8", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#0c4a6e", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["nature-waterfall"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "space-galaxy", name: "Galaxy", category: "space",
    editorState: {
      font: "audiowide", theme: "ink", fontSize: 1.1, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.8,
      textColor: "#818cf8", authorFont: "heading", authorColor: "#6366f1", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#0f0720", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["space-galaxy"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "space-moon", name: "Moonrise", category: "space",
    editorState: {
      font: "playfair", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#e2e8f0", authorFont: "heading", authorColor: "#94a3b8", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#0f172a", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["space-moon"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "space-mars", name: "Mars", category: "space",
    editorState: {
      font: "rajdhani", theme: "dark", fontSize: 1.3, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.7,
      textColor: "#f97316", authorFont: "heading", authorColor: "#ea580c", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#1c1917", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["space-mars"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "space-astronaut", name: "Astronaut", category: "space",
    editorState: {
      font: "bebas", theme: "ink", fontSize: 1.8, textAlign: "center", letterSpacing: 0.08, lineHeight: 1.3,
      textColor: "#ffffff", authorFont: "heading", authorColor: "#94a3b8", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#020617", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["space-astronaut"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "coffee-espresso", name: "Espresso", category: "coffee",
    editorState: {
      font: "merriweather", theme: "dark", fontSize: 1.2, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.9,
      textColor: "#fef3c7", authorFont: "heading", authorColor: "#fde68a", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#292524", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["coffee-espresso"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "coffee-morning", name: "Morning", category: "coffee",
    editorState: {
      font: "caveat", theme: "light", fontSize: 1.5, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#78350f", authorFont: "heading", authorColor: "#92400e", authorFontSize: 0.75,
      isBold: false, isItalic: false, backgroundColor: "#fffbeb", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["coffee-morning"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "coffee-brew", name: "Cold Brew", category: "coffee",
    editorState: {
      font: "inter", theme: "dark", fontSize: 1.2, textAlign: "center", letterSpacing: 0.04, lineHeight: 2.0,
      textColor: "#a3e635", authorFont: "heading", authorColor: "#84cc16", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["coffee-brew"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "coffee-cozy", name: "Café", category: "coffee",
    editorState: {
      font: "dancing", theme: "cream", fontSize: 1.5, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.6,
      textColor: "#44403c", authorFont: "heading", authorColor: "#78716c", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#f5f0e8", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["coffee-cozy"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "pets-cat", name: "Cat", category: "pets",
    editorState: {
      font: "caveat", theme: "light", fontSize: 1.5, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#7c3aed", authorFont: "heading", authorColor: "#8b5cf6", authorFontSize: 0.75,
      isBold: false, isItalic: false, backgroundColor: "#f5f3ff", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["pets-cat"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "pets-puppy", name: "Puppy", category: "pets",
    editorState: {
      font: "poppins", theme: "light", fontSize: 1.3, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.8,
      textColor: "#b45309", authorFont: "heading", authorColor: "#d97706", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#fffbeb", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["pets-puppy"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "pets-bird", name: "Feathered", category: "pets",
    editorState: {
      font: "lora", theme: "light", fontSize: 1.3, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.8,
      textColor: "#0e7490", authorFont: "heading", authorColor: "#0891b2", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#ecfeff", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["pets-bird"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "pets-bunny", name: "Bunny", category: "pets",
    editorState: {
      font: "dancing", theme: "light", fontSize: 1.5, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.6,
      textColor: "#be185d", authorFont: "heading", authorColor: "#db2777", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#fdf2f8", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["pets-bunny"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "books-novel", name: "Novel", category: "books",
    editorState: {
      font: "playfair", theme: "cream", fontSize: 1.4, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#44403c", authorFont: "heading", authorColor: "#78716c", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#f5f0e8", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["books-novel"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "books-study", name: "Study", category: "books",
    editorState: {
      font: "mono", theme: "dark", fontSize: 1.1, textAlign: "left", letterSpacing: 0.02, lineHeight: 2.0,
      textColor: "#e2e8f0", authorFont: "heading", authorColor: "#94a3b8", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#0f172a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["books-study"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "books-poetry", name: "Poetry", category: "books",
    editorState: {
      font: "cormorant", theme: "cream", fontSize: 1.5, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#581c87", authorFont: "heading", authorColor: "#7e22ce", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#f3e8ff", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["books-poetry"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "books-classic", name: "Classic", category: "books",
    editorState: {
      font: "merriweather", theme: "dark", fontSize: 1.2, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.9,
      textColor: "#d4af37", authorFont: "heading", authorColor: "#b8860b", authorFontSize: 0.75,
      isBold: false, isItalic: false, backgroundColor: "#1c1917", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["books-classic"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "art-canvas", name: "Canvas", category: "art",
    editorState: {
      font: "great-vibes", theme: "light", fontSize: 1.8, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#1c1917", authorFont: "heading", authorColor: "#57534e", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#fafaf9", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["art-canvas"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "art-graffiti", name: "Graffiti", category: "art",
    editorState: {
      font: "permanent-marker", theme: "dark", fontSize: 1.5, textAlign: "left", letterSpacing: 0.0, lineHeight: 1.4,
      textColor: "#ef4444", authorFont: "heading", authorColor: "#dc2626", authorFontSize: 0.75,
      isBold: false, isItalic: false, backgroundColor: "#18181b", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["art-graffiti"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "art-minimal", name: "Gallery", category: "art",
    editorState: {
      font: "inter", theme: "light", fontSize: 1.2, textAlign: "center", letterSpacing: 0.06, lineHeight: 2.2,
      textColor: "#374151", authorFont: "heading", authorColor: "#6b7280", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#f9fafb", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["art-minimal"], backgroundOpacity: 0.25,
    },
  },
  {
    id: "art-abstract", name: "Abstract", category: "art",
    editorState: {
      font: "oswald", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.4,
      textColor: "#f0abfc", authorFont: "heading", authorColor: "#d946ef", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["art-abstract"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "tech-code", name: "Code", category: "tech",
    editorState: {
      font: "mono", theme: "ink", fontSize: 1.0, textAlign: "left", letterSpacing: 0.02, lineHeight: 2.2,
      textColor: "#4ade80", authorFont: "heading", authorColor: "#22c55e", authorFontSize: 0.6,
      isBold: false, isItalic: false, backgroundColor: "#020617", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["tech-code"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "tech-minimal", name: "Clean Tech", category: "tech",
    editorState: {
      font: "inter", theme: "dark", fontSize: 1.2, textAlign: "center", letterSpacing: 0.04, lineHeight: 2.0,
      textColor: "#e2e8f0", authorFont: "heading", authorColor: "#94a3b8", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#0f172a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["tech-minimal"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "tech-neon", name: "Neon Tech", category: "tech",
    editorState: {
      font: "orbitron", theme: "ink", fontSize: 1.1, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.8,
      textColor: "#22d3ee", authorFont: "rajdhani", authorColor: "#06b6d4", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["tech-neon"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "tech-gaming", name: "Gaming Setup", category: "tech",
    editorState: {
      font: "audiowide", theme: "dark", fontSize: 1.1, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.8,
      textColor: "#e879f9", authorFont: "heading", authorColor: "#d946ef", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#0f0720", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["tech-gaming"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "cars-classic", name: "Classic", category: "cars",
    editorState: {
      font: "playfair", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#d4af37", authorFont: "heading", authorColor: "#b8860b", authorFontSize: 0.75,
      isBold: false, isItalic: true, backgroundColor: "#1c1917", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["cars-classic"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "cars-drift", name: "Drift", category: "cars",
    editorState: {
      font: "audiowide", theme: "dark", fontSize: 1.2, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.7,
      textColor: "#ef4444", authorFont: "heading", authorColor: "#dc2626", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["cars-drift"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "crypto-defi", name: "DeFi", category: "crypto",
    editorState: {
      font: "rajdhani", theme: "dark", fontSize: 1.3, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.7,
      textColor: "#a5f3fc", authorFont: "heading", authorColor: "#22d3ee", authorFontSize: 0.65,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["crypto-defi"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "crypto-nft", name: "NFT", category: "crypto",
    editorState: {
      font: "audiowide", theme: "ink", fontSize: 1.1, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.8,
      textColor: "#e879f9", authorFont: "heading", authorColor: "#d946ef", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#0f0720", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["crypto-nft"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "science-space", name: "Cosmos", category: "science",
    editorState: {
      font: "orbitron", theme: "ink", fontSize: 1.1, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.8,
      textColor: "#c4b5fd", authorFont: "heading", authorColor: "#8b5cf6", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#0f0720", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["science-space"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "science-micro", name: "Microscope", category: "science",
    editorState: {
      font: "mono", theme: "dark", fontSize: 1.0, textAlign: "left", letterSpacing: 0.02, lineHeight: 2.2,
      textColor: "#4ade80", authorFont: "heading", authorColor: "#22c55e", authorFontSize: 0.6,
      isBold: false, isItalic: false, backgroundColor: "#020617", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["science-micro"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "architecture-skyline", name: "Skyline", category: "architecture",
    editorState: {
      font: "bebas", theme: "dark", fontSize: 2.0, textAlign: "center", letterSpacing: 0.08, lineHeight: 1.2,
      textColor: "#ffffff", authorFont: "heading", authorColor: "#94a3b8", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["architecture-skyline"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "architecture-minimal", name: "Minimal", category: "architecture",
    editorState: {
      font: "inter", theme: "light", fontSize: 1.2, textAlign: "center", letterSpacing: 0.04, lineHeight: 2.0,
      textColor: "#374151", authorFont: "heading", authorColor: "#6b7280", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#f9fafb", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["architecture-minimal"], backgroundOpacity: 0.25,
    },
  },
  {
    id: "education-chalk", name: "Chalkboard", category: "education",
    editorState: {
      font: "caveat", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#ffffff", authorFont: "heading", authorColor: "#d4d4d8", authorFontSize: 0.75,
      isBold: false, isItalic: false, backgroundColor: "#1e293b", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["education-chalk"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "education-science", name: "Lab", category: "education",
    editorState: {
      font: "mono", theme: "dark", fontSize: 1.1, textAlign: "left", letterSpacing: 0.02, lineHeight: 2.0,
      textColor: "#4ade80", authorFont: "heading", authorColor: "#22c55e", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#0f172a", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["education-science"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "parenting-reading", name: "Storytime", category: "parenting",
    editorState: {
      font: "caveat", theme: "cream", fontSize: 1.5, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#78350f", authorFont: "heading", authorColor: "#92400e", authorFontSize: 0.75,
      isBold: false, isItalic: false, backgroundColor: "#fffbeb", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["parenting-reading"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "parenting-nature", name: "Outdoors", category: "parenting",
    editorState: {
      font: "lora", theme: "light", fontSize: 1.3, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.8,
      textColor: "#365314", authorFont: "heading", authorColor: "#4d7c0f", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#f0fdf4", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["parenting-nature"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "real-estate-garden", name: "Garden", category: "real-estate",
    editorState: {
      font: "lora", theme: "light", fontSize: 1.3, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.8,
      textColor: "#365314", authorFont: "heading", authorColor: "#4d7c0f", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#f0fdf4", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["real-estate-garden"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "real-estate-skyline", name: "Skyline", category: "real-estate",
    editorState: {
      font: "bebas", theme: "dark", fontSize: 1.8, textAlign: "center", letterSpacing: 0.08, lineHeight: 1.3,
      textColor: "#ffffff", authorFont: "heading", authorColor: "#94a3b8", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0f172a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["real-estate-skyline"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "wellness-nature", name: "Forest Bath", category: "wellness",
    editorState: {
      font: "cormorant", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#86efac", authorFont: "heading", authorColor: "#4ade80", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#052e16", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["wellness-nature"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "wellness-journal", name: "Journal", category: "wellness",
    editorState: {
      font: "caveat", theme: "cream", fontSize: 1.5, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#44403c", authorFont: "heading", authorColor: "#78716c", authorFontSize: 0.75,
      isBold: false, isItalic: false, backgroundColor: "#f5f0e8", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["wellness-journal"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "motivation-sunrise", name: "Sunrise", category: "motivation",
    editorState: {
      font: "bebas", theme: "dark", fontSize: 2.0, textAlign: "center", letterSpacing: 0.08, lineHeight: 1.2,
      textColor: "#fbbf24", authorFont: "heading", authorColor: "#f59e0b", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#1c1917", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["motivation-sunrise"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "motivation-lion", name: "Fearless", category: "motivation",
    editorState: {
      font: "archivo", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.4,
      textColor: "#ef4444", authorFont: "heading", authorColor: "#dc2626", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["motivation-lion"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "business-skyline", name: "Downtown", category: "business",
    editorState: {
      font: "oswald", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.4,
      textColor: "#ffffff", authorFont: "heading", authorColor: "#94a3b8", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["business-skyline"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "business-laptop", name: "Remote", category: "business",
    editorState: {
      font: "inter", theme: "light", fontSize: 1.2, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.9,
      textColor: "#374151", authorFont: "heading", authorColor: "#6b7280", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#f9fafb", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["business-laptop"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "photography-macro", name: "Macro", category: "photography",
    editorState: {
      font: "lora", theme: "dark", fontSize: 1.3, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.8,
      textColor: "#fef3c7", authorFont: "heading", authorColor: "#fbbf24", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#1c1917", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["photography-macro"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "photography-bw", name: "B&W", category: "photography",
    editorState: {
      font: "heading", theme: "dark", fontSize: 1.5, textAlign: "left", letterSpacing: 0.0, lineHeight: 1.3,
      textColor: "#ffffff", authorFont: "heading", authorColor: "#525252", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["photography-bw"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "aviation-jet", name: "Fighter", category: "aviation",
    editorState: {
      font: "archivo", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.4,
      textColor: "#ef4444", authorFont: "heading", authorColor: "#dc2626", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["aviation-jet"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "aviation-clouds", name: "Above Clouds", category: "aviation",
    editorState: {
      font: "cormorant", theme: "light", fontSize: 1.5, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#0e7490", authorFont: "heading", authorColor: "#0891b2", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#ecfeff", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["aviation-clouds"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "maritime-port", name: "Harbor", category: "maritime",
    editorState: {
      font: "oswald", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.4,
      textColor: "#fbbf24", authorFont: "heading", authorColor: "#f59e0b", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#292524", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["maritime-port"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "maritime-sail", name: "Sailing", category: "maritime",
    editorState: {
      font: "satisfy", theme: "light", fontSize: 1.6, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#0e7490", authorFont: "heading", authorColor: "#0891b2", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#ecfeff", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["maritime-sail"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "law-court", name: "Courtroom", category: "law",
    editorState: {
      font: "oswald", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.5,
      textColor: "#e2e8f0", authorFont: "heading", authorColor: "#94a3b8", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#1e293b", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["law-court"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "law-scales", name: "Scales", category: "law",
    editorState: {
      font: "lora", theme: "dark", fontSize: 1.3, textAlign: "center", letterSpacing: 0.01, lineHeight: 1.8,
      textColor: "#d4af37", authorFont: "heading", authorColor: "#b8860b", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#1c1917", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["law-scales"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "baking-cake", name: "Layer Cake", category: "baking",
    editorState: {
      font: "great-vibes", theme: "light", fontSize: 1.7, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#be185d", authorFont: "heading", authorColor: "#9d174d", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#fff1f2", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["baking-cake"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "baking-sourdough", name: "Sourdough", category: "baking",
    editorState: {
      font: "merriweather", theme: "cream", fontSize: 1.2, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.9,
      textColor: "#78350f", authorFont: "heading", authorColor: "#92400e", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#fffbeb", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["baking-sourdough"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "banking-wall", name: "Wall Street", category: "banking",
    editorState: {
      font: "bebas", theme: "dark", fontSize: 2.0, textAlign: "center", letterSpacing: 0.08, lineHeight: 1.2,
      textColor: "#22c55e", authorFont: "heading", authorColor: "#16a34a", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0a0a0a", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["banking-wall"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "banking-gold", name: "Gold", category: "banking",
    editorState: {
      font: "cormorant", theme: "dark", fontSize: 1.5, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#d4af37", authorFont: "heading", authorColor: "#b8860b", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#0c0a09", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["banking-gold"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "funny-meme", name: "Meme Lord", category: "funny",
    editorState: {
      font: "archivo", theme: "light", fontSize: 1.4, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.5,
      textColor: "#0a0a0a", authorFont: "heading", authorColor: "#525252", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#fef9c3", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["funny-meme"], backgroundOpacity: 0.25,
    },
  },
  {
    id: "funny-sarcasm", name: "Sarcasm", category: "funny",
    editorState: {
      font: "mono", theme: "dark", fontSize: 1.1, textAlign: "left", letterSpacing: 0.02, lineHeight: 2.0,
      textColor: "#e2e8f0", authorFont: "heading", authorColor: "#94a3b8", authorFontSize: 0.65,
      isBold: false, isItalic: false, backgroundColor: "#18181b", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["funny-sarcasm"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "farming-sunrise", name: "Dawn", category: "farming",
    editorState: {
      font: "playfair", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#fef3c7", authorFont: "heading", authorColor: "#fbbf24", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#1c1917", textShadow: "soft", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["farming-sunrise"], backgroundOpacity: 0.4,
    },
  },
  {
    id: "farming-vineyard", name: "Vineyard", category: "farming",
    editorState: {
      font: "cormorant", theme: "cream", fontSize: 1.5, textAlign: "center", letterSpacing: 0.02, lineHeight: 1.7,
      textColor: "#581c87", authorFont: "heading", authorColor: "#7e22ce", authorFontSize: 0.7,
      isBold: false, isItalic: true, backgroundColor: "#f3e8ff", textShadow: "none", showQuotationMarks: true,
      backgroundImage: PEXELS_IMAGES["farming-vineyard"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "history-scroll", name: "Scroll", category: "history",
    editorState: {
      font: "great-vibes", theme: "cream", fontSize: 1.7, textAlign: "center", letterSpacing: 0.0, lineHeight: 1.5,
      textColor: "#78350f", authorFont: "heading", authorColor: "#92400e", authorFontSize: 0.7,
      isBold: false, isItalic: false, backgroundColor: "#fffbeb", textShadow: "none", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["history-scroll"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "history-map", name: "Explorer", category: "history",
    editorState: {
      font: "oswald", theme: "dark", fontSize: 1.4, textAlign: "center", letterSpacing: 0.06, lineHeight: 1.5,
      textColor: "#fbbf24", authorFont: "heading", authorColor: "#f59e0b", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#292524", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["history-map"], backgroundOpacity: 0.35,
    },
  },
  {
    id: "autonomy-ai", name: "Neural", category: "autonomy",
    editorState: {
      font: "mono", theme: "ink", fontSize: 1.0, textAlign: "left", letterSpacing: 0.02, lineHeight: 2.2,
      textColor: "#4ade80", authorFont: "heading", authorColor: "#22c55e", authorFontSize: 0.6,
      isBold: false, isItalic: false, backgroundColor: "#020617", textShadow: "glow", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["autonomy-ai"], backgroundOpacity: 0.3,
    },
  },
  {
    id: "autonomy-smart", name: "Smart City", category: "autonomy",
    editorState: {
      font: "bebas", theme: "dark", fontSize: 1.8, textAlign: "center", letterSpacing: 0.08, lineHeight: 1.3,
      textColor: "#38bdf8", authorFont: "heading", authorColor: "#0ea5e9", authorFontSize: 0.7,
      isBold: true, isItalic: false, backgroundColor: "#0c4a6e", textShadow: "soft", showQuotationMarks: false,
      backgroundImage: PEXELS_IMAGES["autonomy-smart"], backgroundOpacity: 0.4,
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
  { value: "cars", label: "Cars" },
  { value: "crypto", label: "Crypto" },
  { value: "science", label: "Science" },
  { value: "architecture", label: "Architecture" },
  { value: "education", label: "Education" },
  { value: "parenting", label: "Parenting" },
  { value: "real-estate", label: "Real Estate" },
  { value: "wellness", label: "Wellness" },
  { value: "motivation", label: "Motivation" },
  { value: "business", label: "Business" },
  { value: "photography", label: "Photography" },
  { value: "aviation", label: "Aviation" },
  { value: "maritime", label: "Maritime" },
  { value: "law", label: "Law" },
  { value: "baking", label: "Baking" },
  { value: "banking", label: "Banking" },
  { value: "funny", label: "Funny" },
  { value: "farming", label: "Farming" },
  { value: "history", label: "History" },
  { value: "autonomy", label: "Autonomy" },
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
  "cars-supercar": { text: "RACING IS LIFE. EVERYTHING ELSE IS JUST WAITING.", author: "Steve McQueen" },
  "cars-vintage": { text: "A dream without ambition is like a car without gas.", author: "Sean Hampton" },
  "cars-racing": { text: "IF EVERYTHING SEEMS UNDER CONTROL, YOU'RE NOT GOING FAST ENOUGH.", author: "Mario Andretti" },
  "crypto-bitcoin": { text: "BITCOIN IS A TECHNOLOGICAL TOUR DE FORCE.", author: "Bill Gates" },
  "crypto-blockchain": { text: "THE BLOCKCHAIN DOES ONE THING: IT REPLACES THIRD-PARTY TRUST WITH MATHEMATICAL PROOF.", author: "Adam Draper" },
  "crypto-trading": { text: "The stock market is a device for transferring money from the impatient to the patient.", author: "Warren Buffett" },
  "science-lab": { text: "The important thing is not to stop questioning.", author: "Albert Einstein" },
  "science-dna": { text: "Nothing in biology makes sense except in the light of evolution.", author: "Theodosius Dobzhansky" },
  "science-chemistry": { text: "The good thing about science is that it's true whether or not you believe in it.", author: "Neil deGrasse Tyson" },
  "architecture-modern": { text: "LESS IS MORE.", author: "Ludwig Mies van der Rohe" },
  "architecture-classic": { text: "Architecture is the learned game, correct and magnificent, of forms assembled in the light.", author: "Le Corbusier" },
  "architecture-interior": { text: "Design is not just what it looks like. Design is how it works.", author: "Steve Jobs" },
  "education-classroom": { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  "education-books": { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  "education-graduation": { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  "parenting-family": { text: "The most important thing a father can do for his children is to love their mother.", author: "Theodore Hesburgh" },
  "parenting-baby": { text: "A baby is born with a need to be loved — and never outgrows it.", author: "Frank A. Clark" },
  "parenting-playground": { text: "Children are not things to be molded, but people to be unfolded.", author: "Jess Lair" },
  "real-estate-luxury": { text: "Real estate cannot be lost or stolen, nor can it be carried away.", author: "Franklin D. Roosevelt" },
  "real-estate-city": { text: "Don't wait to buy real estate. Buy real estate and wait.", author: "Will Rogers" },
  "real-estate-interior": { text: "Home is where love resides, memories are created, and laughter never ends.", author: "Unknown" },
  "wellness-meditation": { text: "The mind is everything. What you think you become.", author: "Buddha" },
  "wellness-yoga": { text: "Yoga is the journey of the self, through the self, to the self.", author: "The Bhagavad Gita" },
  "wellness-spa": { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
  "motivation-summit": { text: "IT'S NOT THE MOUNTAIN WE CONQUER, BUT OURSELVES.", author: "Edmund Hillary" },
  "motivation-road": { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  "motivation-hustle": { text: "WORK HARD IN SILENCE. LET SUCCESS MAKE THE NOISE.", author: "Frank Ocean" },
  "business-office": { text: "Your work is going to fill a large part of your life. Make it great.", author: "Steve Jobs" },
  "business-meeting": { text: "Coming together is a beginning. Keeping together is progress. Working together is success.", author: "Henry Ford" },
  "business-startup": { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  "photography-portrait": { text: "A portrait is not made in the camera but on either side of it.", author: "Edward Steichen" },
  "photography-landscape": { text: "In every walk with nature one receives far more than he seeks.", author: "John Muir" },
  "photography-street": { text: "Photography is the story I fail to put into words.", author: "Destin Sparks" },
  "aviation-cockpit": { text: "ONCE YOU HAVE TASTED FLIGHT, YOU WILL FOREVER WALK THE EARTH WITH YOUR EYES TURNED SKYWARD.", author: "Leonardo da Vinci" },
  "aviation-sky": { text: "THE ENGINE IS THE HEART OF AN AIRPLANE, BUT THE PILOT IS ITS SOUL.", author: "Walter Raleigh" },
  "aviation-sunset": { text: "For once you have tasted flight you will walk the earth with your eyes turned skywards.", author: "Leonardo da Vinci" },
  "maritime-ocean": { text: "The sea, once it casts its spell, holds one in its net of wonder forever.", author: "Jacques Cousteau" },
  "maritime-ship": { text: "A SHIP IN HARBOR IS SAFE, BUT THAT IS NOT WHAT SHIPS ARE BUILT FOR.", author: "John A. Shedd" },
  "maritime-lighthouse": { text: "A lighthouse is not interested in who gets its light. It just gives it without thinking.", author: "Mehmet Murat Ildan" },
  "law-justice": { text: "Injustice anywhere is a threat to justice everywhere.", author: "Martin Luther King Jr." },
  "law-gavel": { text: "The law is reason, free from passion.", author: "Aristotle" },
  "law-books": { text: "Where there is no law, there is no freedom.", author: "John Locke" },
  "baking-bread": { text: "Baking is love made edible.", author: "Anonymous" },
  "baking-pastry": { text: "Life is uncertain. Eat dessert first.", author: "Ernestine Ulmer" },
  "baking-kitchen": { text: "In baking, follow directions. In cooking, go by your own taste.", author: "Laiko Bahrs" },
  "banking-vault": { text: "A BANK IS A PLACE THAT WILL LEND YOU MONEY IF YOU CAN PROVE THAT YOU DON'T NEED IT.", author: "Bob Hope" },
  "banking-finance": { text: "Compound interest is the eighth wonder of the world.", author: "Albert Einstein" },
  "banking-coins": { text: "Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver.", author: "Ayn Rand" },
  "funny-laugh": { text: "I'M NOT SUPERSTITIOUS, BUT I AM A LITTLE STITIOUS.", author: "Michael Scott" },
  "funny-silly": { text: "Behind every great man is a woman rolling her eyes.", author: "Jim Carrey" },
  "funny-comedy": { text: "I USED TO THINK I WAS INDECISIVE. BUT NOW I'M NOT SO SURE.", author: "Unknown" },
  "farming-field": { text: "The farmer is the only man in our economy who buys everything at retail and sells everything at wholesale.", author: "John F. Kennedy" },
  "farming-harvest": { text: "Agriculture is the most healthful, most useful, and most noble employment of man.", author: "George Washington" },
  "farming-barn": { text: "To plant a garden is to believe in tomorrow.", author: "Audrey Hepburn" },
  "history-ruins": { text: "Those who cannot remember the past are condemned to repeat it.", author: "George Santayana" },
  "history-ancient": { text: "History is written by the victors.", author: "Winston Churchill" },
  "history-medieval": { text: "The more you know about the past, the better prepared you are for the future.", author: "Theodore Roosevelt" },
  "autonomy-robot": { text: "THE QUESTION IS NOT WHETHER MACHINES THINK BUT WHETHER MEN DO.", author: "B.F. Skinner" },
  "autonomy-drone": { text: "THE BEST WAY TO PREDICT THE FUTURE IS TO CREATE IT.", author: "Peter Drucker" },
  "autonomy-selfdriving": { text: "Technology is best when it brings people together.", author: "Matt Mullenweg" },
  "minimal-zen": { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  "minimal-air": { text: "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.", author: "Oprah Winfrey" },
  "bold-neon": { text: "BE THE CHANGE THAT YOU WISH TO SEE IN THE WORLD.", author: "Mahatma Gandhi" },
  "retro-vinyl": { text: "Music gives a soul to the universe, wings to the mind, flight to the imagination.", author: "Plato" },
  "elegant-pearl": { text: "Elegance is when the inside is as beautiful as the outside.", author: "Coco Chanel" },
  "playful-doodle": { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  "playful-candy": { text: "Life is short. Smile while you still have teeth.", author: "Mallory Hopkins" },
  "food-gourmet": { text: "People who love to eat are always the best people.", author: "Julia Child" },
  "food-fresh": { text: "Let food be thy medicine and medicine be thy food.", author: "Hippocrates" },
  "food-spice": { text: "COOKING IS LIKE LOVE. IT SHOULD BE ENTERED INTO WITH ABANDON OR NOT AT ALL.", author: "Harriet Van Horne" },
  "food-sweet": { text: "Life is short, eat dessert first.", author: "Jacques Torres" },
  "sports-track": { text: "THE HARDER THE BATTLE, THE SWEETER THE VICTORY.", author: "Les Brown" },
  "sports-court": { text: "YOU MISS 100% OF THE SHOTS YOU DON'T TAKE.", author: "Wayne Gretzky" },
  "sports-swim": { text: "THE WATER IS YOUR FRIEND. YOU DON'T HAVE TO FIGHT WITH WATER.", author: "Alexander Popov" },
  "sports-climb": { text: "It's not the mountain we conquer, but ourselves.", author: "Edmund Hillary" },
  "home-modern": { text: "Home is not a place, it's a feeling.", author: "Cecelia Ahern" },
  "home-rustic": { text: "The ache for home lives in all of us.", author: "Maya Angelou" },
  "home-garden": { text: "Where we love is home – home that our feet may leave, but not our hearts.", author: "Oliver Wendell Holmes" },
  "home-fireplace": { text: "A house is made of walls and beams; a home is built with love and dreams.", author: "Ralph Waldo Emerson" },
  "garden-zen": { text: "Gardens are not made by singing 'Oh, how beautiful,' and sitting in the shade.", author: "Rudyard Kipling" },
  "garden-wild": { text: "Like wildflowers; you must allow yourself to grow in all the places people thought you never would.", author: "E.V." },
  "garden-herb": { text: "He who plants a garden, plants happiness.", author: "Chinese Proverb" },
  "garden-sunset": { text: "The glory of gardening: hands in the dirt, head in the sun, heart with nature.", author: "Alfred Austin" },
  "construction-crane": { text: "WE BUILD TOO MANY WALLS AND NOT ENOUGH BRIDGES.", author: "Isaac Newton" },
  "construction-blueprint": { text: "Good buildings come from good people, and all problems are solved by good design.", author: "Stephen Gardiner" },
  "construction-concrete": { text: "THE DETAILS ARE NOT THE DETAILS. THEY MAKE THE DESIGN.", author: "Charles Eames" },
  "construction-tools": { text: "THE BEST WAY TO PREDICT THE FUTURE IS TO BUILD IT.", author: "Alan Kay" },
  "ai-circuit": { text: "ARTIFICIAL INTELLIGENCE IS THE NEW ELECTRICITY.", author: "Andrew Ng" },
  "ai-matrix": { text: "The real question is, when will we draft an artificial intelligence bill of rights?", author: "Gray Scott" },
  "ai-quantum": { text: "AI IS LIKELY TO BE EITHER THE BEST OR WORST THING TO HAPPEN TO HUMANITY.", author: "Stephen Hawking" },
  "ai-data": { text: "Data is the new oil.", author: "Clive Humby" },
  "fashion-runway": { text: "FASHION IS THE ARMOR TO SURVIVE THE REALITY OF EVERYDAY LIFE.", author: "Bill Cunningham" },
  "fashion-editorial": { text: "Style is a way to say who you are without having to speak.", author: "Rachel Zoe" },
  "fashion-street": { text: "IN DIFFICULT TIMES, FASHION IS ALWAYS OUTRAGEOUS.", author: "Elsa Schiaparelli" },
  "fashion-haute": { text: "Fashion fades, only style remains the same.", author: "Coco Chanel" },
  "film-noir": { text: "Life is like a movie. Write your own ending.", author: "Jim Henson" },
  "film-indie": { text: "Every great film should seem new every time you see it.", author: "Roger Ebert" },
  "film-action": { text: "I'LL BE BACK.", author: "The Terminator" },
  "film-romance": { text: "You had me at hello.", author: "Jerry Maguire" },
  "games-rpg": { text: "THE CAKE IS A LIE.", author: "Portal" },
  "games-retro": { text: "It's dangerous to go alone! Take this.", author: "The Legend of Zelda" },
  "games-strategy": { text: "WAR. WAR NEVER CHANGES.", author: "Fallout" },
  "games-fantasy": { text: "A hero need not speak. When he is gone, the world will speak for him.", author: "Halo" },
  "weather-rain": { text: "Let the rain kiss you. Let the rain beat upon your head with silver liquid drops.", author: "Langston Hughes" },
  "weather-snow": { text: "Snowflakes are one of nature's most fragile things, but just look what they can do when they stick together.", author: "Vesta Kelly" },
  "weather-fog": { text: "The fog comes on little cat feet.", author: "Carl Sandburg" },
  "weather-sunny": { text: "Wherever you go, no matter what the weather, always bring your own sunshine.", author: "Anthony J. D'Angelo" },
  "travel-mountain": { text: "NOT ALL THOSE WHO WANDER ARE LOST.", author: "J.R.R. Tolkien" },
  "travel-city": { text: "TRAVEL MAKES ONE MODEST. YOU SEE WHAT A TINY PLACE YOU OCCUPY IN THE WORLD.", author: "Gustave Flaubert" },
  "travel-desert": { text: "THE DESERT TELLS A DIFFERENT STORY EVERY TIME ONE VENTURES ON IT.", author: "Robert Edison Fulton Jr." },
  "travel-beach": { text: "At the beach, life is different. Time doesn't move hour to hour but mood to moment.", author: "Sandy Gingras" },
  "music-vinyl": { text: "MUSIC IS THE SOUNDTRACK OF YOUR LIFE.", author: "Dick Clark" },
  "music-piano": { text: "Without music, life would be a mistake.", author: "Friedrich Nietzsche" },
  "music-festival": { text: "MUSIC CAN CHANGE THE WORLD BECAUSE IT CAN CHANGE PEOPLE.", author: "Bono" },
  "music-jazz": { text: "Jazz is the only music in which the same note can be played night after night but differently each time.", author: "Ornette Coleman" },
  "fitness-run": { text: "THE BODY ACHIEVES WHAT THE MIND BELIEVES.", author: "Napoleon Hill" },
  "fitness-yoga": { text: "Yoga is the journey of the self, through the self, to the self.", author: "The Bhagavad Gita" },
  "fitness-box": { text: "FLOAT LIKE A BUTTERFLY, STING LIKE A BEE.", author: "Muhammad Ali" },
  "fitness-swim": { text: "THE PAIN YOU FEEL TODAY WILL BE THE STRENGTH YOU FEEL TOMORROW.", author: "Arnold Schwarzenegger" },
  "nature-forest": { text: "In every walk with nature, one receives far more than he seeks.", author: "John Muir" },
  "nature-ocean": { text: "The ocean stirs the heart, inspires the imagination, and brings eternal joy to the soul.", author: "Wyland" },
  "nature-desert": { text: "THE DESERT DOES NOT COUNT THE GRAINS OF SAND.", author: "African Proverb" },
  "nature-waterfall": { text: "Water is the driving force of all nature.", author: "Leonardo da Vinci" },
  "space-galaxy": { text: "THE UNIVERSE IS UNDER NO OBLIGATION TO MAKE SENSE TO YOU.", author: "Neil deGrasse Tyson" },
  "space-moon": { text: "Shoot for the moon. Even if you miss, you'll land among the stars.", author: "Les Brown" },
  "space-mars": { text: "MARS IS THERE, WAITING TO BE REACHED.", author: "Buzz Aldrin" },
  "space-astronaut": { text: "THAT'S ONE SMALL STEP FOR MAN, ONE GIANT LEAP FOR MANKIND.", author: "Neil Armstrong" },
  "coffee-espresso": { text: "Coffee is a language in itself.", author: "Jackie Chan" },
  "coffee-morning": { text: "Even bad coffee is better than no coffee at all.", author: "David Lynch" },
  "coffee-brew": { text: "Science may never come up with a better office communication system than the coffee break.", author: "Earl Wilson" },
  "coffee-cozy": { text: "Behind every successful person is a substantial amount of coffee.", author: "Stephanie Piro" },
  "pets-cat": { text: "Time spent with cats is never wasted.", author: "Sigmund Freud" },
  "pets-puppy": { text: "Dogs are not our whole life, but they make our lives whole.", author: "Roger Caras" },
  "pets-bird": { text: "Hold fast to dreams, for if dreams die, life is a broken-winged bird that cannot fly.", author: "Langston Hughes" },
  "pets-bunny": { text: "Some people talk to animals. Not many listen though. That's the problem.", author: "A.A. Milne" },
  "books-novel": { text: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero" },
  "books-study": { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  "books-poetry": { text: "Poetry is when an emotion has found its thought and the thought has found words.", author: "Robert Frost" },
  "books-classic": { text: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
  "art-canvas": { text: "Art is not what you see, but what you make others see.", author: "Edgar Degas" },
  "art-graffiti": { text: "ART SHOULD COMFORT THE DISTURBED AND DISTURB THE COMFORTABLE.", author: "Cesar Cruz" },
  "art-minimal": { text: "Art enables us to find ourselves and lose ourselves at the same time.", author: "Thomas Merton" },
  "art-abstract": { text: "CREATIVITY TAKES COURAGE.", author: "Henri Matisse" },
  "tech-code": { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  "tech-minimal": { text: "Technology is best when it brings people together.", author: "Matt Mullenweg" },
  "tech-neon": { text: "THE BEST WAY TO PREDICT THE FUTURE IS TO INVENT IT.", author: "Alan Kay" },
  "tech-gaming": { text: "TECHNOLOGY IS NOTHING. WHAT'S IMPORTANT IS THAT YOU HAVE A FAITH IN PEOPLE.", author: "Steve Jobs" },
  "cars-classic": { text: "The cars we drive say a lot about us.", author: "Alexandra Paul" },
  "cars-drift": { text: "SPEED HAS NEVER KILLED ANYONE. SUDDENLY BECOMING STATIONARY, THAT'S WHAT GETS YOU.", author: "Jeremy Clarkson" },
  "crypto-defi": { text: "DECENTRALIZATION IS THE FUTURE.", author: "Vitalik Buterin" },
  "crypto-nft": { text: "IN CRYPTO, TRUST IS BUILT THROUGH CODE.", author: "Anonymous" },
  "science-space": { text: "SCIENCE IS NOT ONLY A DISCIPLE OF REASON BUT ALSO ONE OF ROMANCE AND PASSION.", author: "Stephen Hawking" },
  "science-micro": { text: "Equipped with his five senses, man explores the universe around him and calls the adventure Science.", author: "Edwin Hubble" },
  "architecture-skyline": { text: "ARCHITECTURE SHOULD SPEAK OF ITS TIME AND PLACE.", author: "Frank Gehry" },
  "architecture-minimal": { text: "God is in the details.", author: "Ludwig Mies van der Rohe" },
  "education-chalk": { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  "education-science": { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "William Butler Yeats" },
  "parenting-reading": { text: "The greatest gifts you can give your children are the roots of responsibility and the wings of independence.", author: "Denis Waitley" },
  "parenting-nature": { text: "It's not what you do for your children, but what you have taught them to do for themselves.", author: "Ann Landers" },
  "real-estate-garden": { text: "The best investment on earth is earth.", author: "Louis Glickman" },
  "real-estate-skyline": { text: "EVERY PERSON WHO INVESTS IN WELL-SELECTED REAL ESTATE DOES IT WITH SAFETY.", author: "Franklin D. Roosevelt" },
  "wellness-nature": { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu" },
  "wellness-journal": { text: "Journaling is like whispering to one's self and listening at the same time.", author: "Mina Murray" },
  "motivation-sunrise": { text: "THE ONLY LIMIT TO OUR REALIZATION OF TOMORROW IS OUR DOUBTS OF TODAY.", author: "Franklin D. Roosevelt" },
  "motivation-lion": { text: "COURAGE IS NOT THE ABSENCE OF FEAR, BUT RATHER THE JUDGMENT THAT SOMETHING ELSE IS MORE IMPORTANT.", author: "Ambrose Redmoon" },
  "business-skyline": { text: "SUCCESS USUALLY COMES TO THOSE WHO ARE TOO BUSY TO BE LOOKING FOR IT.", author: "Henry David Thoreau" },
  "business-laptop": { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  "photography-macro": { text: "The camera is an instrument that teaches people how to see without a camera.", author: "Dorothea Lange" },
  "photography-bw": { text: "PHOTOGRAPHY IS THE ONLY LANGUAGE THAT CAN BE UNDERSTOOD ANYWHERE IN THE WORLD.", author: "Bruno Barbey" },
  "aviation-jet": { text: "I FLY BECAUSE IT RELEASES MY MIND FROM THE TYRANNY OF PETTY THINGS.", author: "Antoine de Saint-Exupéry" },
  "aviation-clouds": { text: "The air up there in the clouds is very pure and fine, bracing and delicious.", author: "Mark Twain" },
  "maritime-port": { text: "THE SEA LIVES IN EVERY ONE OF US.", author: "Robert Wyland" },
  "maritime-sail": { text: "Twenty years from now you will be more disappointed by the things you didn't do than by the ones you did.", author: "Mark Twain" },
  "law-court": { text: "JUSTICE DELAYED IS JUSTICE DENIED.", author: "William E. Gladstone" },
  "law-scales": { text: "An unjust law is itself a species of violence.", author: "Mahatma Gandhi" },
  "baking-cake": { text: "Let them eat cake.", author: "Marie Antoinette" },
  "baking-sourdough": { text: "All sorrows are less with bread.", author: "Miguel de Cervantes" },
  "banking-wall": { text: "THE STOCK MARKET IS FILLED WITH INDIVIDUALS WHO KNOW THE PRICE OF EVERYTHING BUT THE VALUE OF NOTHING.", author: "Philip Fisher" },
  "banking-gold": { text: "Money is a terrible master but an excellent servant.", author: "P.T. Barnum" },
  "funny-meme": { text: "I'M NOT LAZY. I'M ON ENERGY SAVING MODE.", author: "Unknown" },
  "funny-sarcasm": { text: "I'm not arguing, I'm just explaining why I'm right.", author: "Unknown" },
  "farming-sunrise": { text: "The farmer has to be an optimist or he wouldn't still be a farmer.", author: "Will Rogers" },
  "farming-vineyard": { text: "Good wine is a necessity of life for me.", author: "Thomas Jefferson" },
  "history-scroll": { text: "The only thing we learn from history is that we learn nothing from history.", author: "Georg Hegel" },
  "history-map": { text: "HISTORY IS NOT THE PAST. IT IS THE PRESENT.", author: "James Baldwin" },
  "autonomy-ai": { text: "The future is already here — it's just not very evenly distributed.", author: "William Gibson" },
  "autonomy-smart": { text: "AUTONOMY IS THE KEY TO HUMAN PROGRESS.", author: "John Stuart Mill" },

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
      <div className="flex gap-1.5 overflow-x-auto pb-0 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
        <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Opacity</span>
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
