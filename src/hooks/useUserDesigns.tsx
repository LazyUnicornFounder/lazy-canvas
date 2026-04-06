import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { DesignEditorState } from "@/components/DesignEditor";

export interface UserDesign {
  id: string;
  title: string;
  editor_state: DesignEditorState;
  created_at: string;
  updated_at: string;
}

export function useUserDesigns() {
  const { user } = useAuth();
  const [designs, setDesigns] = useState<UserDesign[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDesigns = useCallback(async () => {
    if (!user) { setDesigns([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from("user_quotes")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    setDesigns((data as unknown as UserDesign[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchDesigns(); }, [fetchDesigns]);

  const saveDesign = useCallback(async (id: string | null, title: string, editorState: DesignEditorState) => {
    if (!user) return null;
    if (id) {
      const { data } = await supabase
        .from("user_quotes")
        .update({ title, editor_state: JSON.parse(JSON.stringify(editorState)) })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
      await fetchDesigns();
      return data;
    } else {
      const { data } = await supabase
        .from("user_quotes")
        .insert([{ user_id: user.id, title, editor_state: JSON.parse(JSON.stringify(editorState)) }])
        .select()
        .single();
      await fetchDesigns();
      return data;
    }
  }, [user, fetchDesigns]);

  const deleteDesign = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from("user_quotes").delete().eq("id", id).eq("user_id", user.id);
    await fetchDesigns();
  }, [user, fetchDesigns]);

  return { designs, loading, saveDesign, deleteDesign, refetch: fetchDesigns };
}
