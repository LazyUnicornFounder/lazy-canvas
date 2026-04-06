import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, CheckCircle, Mail } from "lucide-react";
import { toast } from "sonner";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  category: string;
  status: string;
  created_at: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  bug: "bg-red-500/10 text-red-400",
  feature: "bg-blue-500/10 text-blue-400",
  comment: "bg-green-500/10 text-green-400",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  read: "Read",
  resolved: "Resolved",
};

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const fetchMessages = async () => {
    setLoading(true);
    let query = supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("category", filter);
    const { data } = await query;
    setMessages((data as Message[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("contact_messages").update({ status }).eq("id", id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const deleteMessage = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    toast.success("Deleted");
  };

  const newCount = messages.filter((m) => m.status === "new").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        {["all", "comment", "bug", "feature"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium transition-all ${
              filter === f ? "bg-foreground text-background" : "bg-accent text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        {newCount > 0 && (
          <span className="text-xs text-muted-foreground">{newCount} new</span>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : messages.length === 0 ? (
        <p className="text-sm text-muted-foreground">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`border border-border rounded-lg p-4 space-y-2 ${m.status === "new" ? "bg-accent/30" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${CATEGORY_COLORS[m.category] ?? "bg-accent text-muted-foreground"}`}>
                    {m.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {STATUS_LABELS[m.status] ?? m.status}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(m.created_at).toLocaleDateString()} {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {m.status === "new" && (
                    <button onClick={() => updateStatus(m.id, "read")} className="p-1 hover:bg-accent rounded" title="Mark as read">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  )}
                  {m.status !== "resolved" && (
                    <button onClick={() => updateStatus(m.id, "resolved")} className="p-1 hover:bg-accent rounded" title="Mark resolved">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    </button>
                  )}
                  <button onClick={() => deleteMessage(m.id)} className="p-1 hover:bg-accent rounded" title="Delete">
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{m.email || "Anonymous"}</p>
              <p className="text-sm text-foreground whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
