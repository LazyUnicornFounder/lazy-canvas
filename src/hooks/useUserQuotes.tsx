import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { QuoteEditorState } from "@/components/QuoteEditor";

export interface UserQuote {
  id: string;
  title: string;
  editor_state: QuoteEditorState;
  created_at: string;
  updated_at: string;
}

export function useUserQuotes() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<UserQuote[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuotes = useCallback(async () => {
    if (!user) { setQuotes([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from("user_quotes")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    setQuotes((data as unknown as UserQuote[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

  const saveQuote = useCallback(async (id: string | null, title: string, editorState: QuoteEditorState) => {
    if (!user) return null;
    if (id) {
      const { data } = await supabase
        .from("user_quotes")
        .update({ title, editor_state: JSON.parse(JSON.stringify(editorState)) })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
      await fetchQuotes();
      return data;
    } else {
      const { data } = await supabase
        .from("user_quotes")
        .insert([{ user_id: user.id, title, editor_state: JSON.parse(JSON.stringify(editorState)) }])
        .select()
        .single();
      await fetchQuotes();
      return data;
    }
  }, [user, fetchQuotes]);

  const deleteQuote = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from("user_quotes").delete().eq("id", id).eq("user_id", user.id);
    await fetchQuotes();
  }, [user, fetchQuotes]);

  return { quotes, loading, saveQuote, deleteQuote, refetch: fetchQuotes };
}
