import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { lovable } from "@/integrations/lovable/index";
import { LogOut, ArrowLeft, Images, Users, ChevronLeft, ChevronRight, Megaphone, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import AdminSlideshow from "@/components/AdminSlideshow";
import AdminUsers from "@/components/AdminUsers";
import AdminWhatsNew from "@/components/AdminWhatsNew";
import AdminMessages from "@/components/AdminMessages";

type AdminSection = "slideshow" | "users" | "whats_new" | "messages";

const NAV_ITEMS: { id: AdminSection; label: string; icon: typeof Images }[] = [
  { id: "slideshow", label: "Slideshow", icon: Images },
  { id: "users", label: "Users", icon: Users },
  { id: "whats_new", label: "What's New", icon: Megaphone },
  { id: "messages", label: "Messages", icon: MessageCircle },
];

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<AdminSection>("slideshow");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleGoogleSignIn = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin",
      extraParams: { prompt: "select_account" },
    });
    if (result.error) toast.error("Sign in failed");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-heading font-semibold text-foreground">Admin Login</h1>
          <p className="text-muted-foreground text-sm">Sign in with Google to access admin panel</p>
          <button
            onClick={handleGoogleSignIn}
            className="px-6 py-3 bg-foreground text-background rounded-md font-heading text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Sign in with Google
          </button>
          <div className="pt-4">
            <button onClick={() => navigate("/")} className="text-xs text-muted-foreground hover:text-foreground">← Back to home</button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-heading font-semibold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground text-sm">You don't have admin privileges.</p>
          <button onClick={signOut} className="text-xs text-muted-foreground hover:text-foreground">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`border-r border-border bg-card/50 flex flex-col transition-all duration-200 ${sidebarCollapsed ? "w-14" : "w-56"}`}>
        <div className="p-3 border-b border-border flex items-center justify-between">
          {!sidebarCollapsed && (
            <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-heading font-medium">Back</span>
            </button>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-heading font-medium transition-all ${
                section === item.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          {!sidebarCollapsed && (
            <p className="text-[10px] text-muted-foreground truncate mb-2">{user.email}</p>
          )}
          <button
            onClick={signOut}
            className={`flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors ${sidebarCollapsed ? "justify-center w-full" : ""}`}
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && <span className="text-xs font-heading">Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="border-b border-border px-6 py-4">
          <h1 className="font-heading text-lg font-semibold tracking-tight text-foreground capitalize">
            {section === "slideshow" ? "Slideshow Designs" : section === "users" ? "Users" : section === "whats_new" ? "What's New" : "Messages"}
          </h1>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {section === "slideshow" && <AdminSlideshow />}
          {section === "users" && <AdminUsers />}
          {section === "whats_new" && <AdminWhatsNew />}
          {section === "messages" && <AdminMessages />}
        </main>
      </div>
    </div>
  );
};

export default Admin;
