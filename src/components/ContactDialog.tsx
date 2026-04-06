import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CATEGORIES = [
  { value: "comment", label: "Comment" },
  { value: "bug", label: "Bug Report" },
  { value: "feature", label: "Feature Request" },
];

export function ContactDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("comment");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      user_id: user?.id ?? null,
      name: user?.email?.split("@")[0] ?? "",
      email: user?.email ?? "",
      message: message.trim(),
      category,
    });
    setSending(false);
    if (error) {
      toast.error("Failed to send message");
    } else {
      toast.success("Message sent!");
      setMessage("");
      setCategory("comment");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-2 w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
          title="Contact us"
        >
          <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">Contact / Feedback</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Send us a message</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium transition-all ${
                  category === c.value
                    ? "bg-foreground text-background"
                    : "bg-accent text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what's on your mind…"
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            required
            maxLength={2000}
          />
          <button
            type="submit"
            disabled={sending || !message.trim()}
            className="w-full px-4 py-2.5 bg-foreground text-background rounded-md font-heading text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {sending ? "Sending…" : "Send Message"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
