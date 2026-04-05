import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, X } from "lucide-react";
import QuotePreview, {
  type AspectRatio,
  type QuoteFont,
  type QuoteTheme,
  type TextShadow,
  type AuthorPosition,
  type ColoredWord,
  type SocialPlatform,
} from "@/components/QuotePreview";
import { toast } from "sonner";

interface Submission {
  id: string;
  created_at: string;
  status: string;
  editor_state: any;
}

const AdminGallery = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery_submissions")
      .select("*")
      .eq("status", filter)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load submissions");
    } else {
      setSubmissions(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("gallery_submissions")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update");
    } else {
      toast.success(status === "approved" ? "Approved!" : "Rejected");
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["pending", "approved", "rejected"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 text-xs font-heading font-medium rounded-md border transition-all capitalize ${
              filter === s
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : submissions.length === 0 ? (
        <p className="text-muted-foreground text-sm">No {filter} submissions.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((sub) => {
            const s = sub.editor_state || {};
            return (
              <div key={sub.id} className="border border-border rounded-lg overflow-hidden bg-card">
                <div className="p-2">
                  <div className="max-w-[200px] mx-auto">
                    <QuotePreview
                      quote={s.quote || ""}
                      authorName={s.authorName || ""}
                      authorPhoto={s.authorPhoto || null}
                      aspectRatio={(s.aspectRatio || "square") as AspectRatio}
                      font={(s.font || "playfair") as QuoteFont}
                      theme={(s.theme || "dark") as QuoteTheme}
                      backgroundImage={s.backgroundImage || null}
                      backgroundOpacity={s.backgroundOpacity ?? 0.4}
                      fontSize={s.fontSize || 1.4}
                      textAlign={s.textAlign || "center"}
                      letterSpacing={s.letterSpacing || 0}
                      lineHeight={s.lineHeight || 1.6}
                      textColor={s.textColor || ""}
                      authorFontSize={s.authorFontSize || 0.875}
                      authorColor={s.authorColor || ""}
                      authorFont={(s.authorFont || "playfair") as QuoteFont}
                      textShadow={(s.textShadow || "none") as TextShadow}
                      authorPosition={(s.authorPosition || "below-quote") as AuthorPosition}
                      backgroundColor={s.backgroundColor || ""}
                      isBold={s.isBold || false}
                      isItalic={s.isItalic || false}
                      coloredWords={Array.isArray(s.coloredWords) ? s.coloredWords : []}
                      showWatermark={false}
                      showQuotationMarks={s.showQuotationMarks || false}
                      socials=""
                    />
                  </div>
                </div>
                <div className="p-3 border-t border-border flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </span>
                  {filter === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(sub.id, "approved")}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-heading font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(sub.id, "rejected")}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-heading font-medium rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-3 h-3" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
