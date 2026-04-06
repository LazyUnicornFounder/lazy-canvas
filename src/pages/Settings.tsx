import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogoWithTagline } from "@/components/MainNav";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  if (authLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!user) {
    navigate("/");
    return null;
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "delete") return;
    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke("delete-account");
      if (error) throw error;
      await signOut();
      toast.success("Account deleted successfully.");
      navigate("/");
    } catch (err) {
      console.error("Delete account error:", err);
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-1.5 hover:bg-accent rounded-md transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <LogoWithTagline />
          </div>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-4 sm:px-6 py-10 space-y-10">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account.</p>
        </div>

        {/* Account info */}
        <section className="space-y-3">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-widest text-muted-foreground">Account</h2>
          <div className="rounded-lg border border-border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm text-foreground">{user.email}</span>
            </div>
          </div>
        </section>

        {/* Danger zone */}
        <section className="space-y-3">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-widest text-destructive">Danger Zone</h2>
          <div className="rounded-lg border border-destructive/30 p-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground">Delete Account</p>
              <p className="text-xs text-muted-foreground mt-1">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-heading font-medium rounded-md bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </section>
      </main>

      <AlertDialog open={showDeleteDialog} onOpenChange={(o) => { if (!o) { setShowDeleteDialog(false); setDeleteConfirm(""); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-destructive">Delete Account</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground space-y-2">
              <span className="block">This will permanently delete your account, all saved designs, uploaded images, and any other data. This cannot be undone.</span>
              <span className="block font-medium text-foreground">Type <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-destructive">delete</span> to confirm.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <input
            type="text"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder='Type "delete" to confirm'
            className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/50"
            autoFocus
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setShowDeleteDialog(false); setDeleteConfirm(""); }}>
              Cancel
            </AlertDialogCancel>
            <button
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== "delete" || deleting}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:pointer-events-none"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {deleting ? "Deleting…" : "Delete Account"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
