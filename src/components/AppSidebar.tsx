import { Plus, FileText, Trash2, Crown, LogOut, CreditCard, Pencil, PanelLeftClose, PanelLeftOpen, ImagePlus, FolderOpen, Loader2, Settings, Sparkles } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { UserDesign } from "@/hooks/useUserDesigns";
import type { DesignEditorState } from "@/components/DesignEditor";
import { LogoWithTagline } from "@/components/MainNav";
import { ContactDialog } from "@/components/ContactDialog";
import { useUserImages } from "@/hooks/useUserImages";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  activeDesignId: string | null;
  onSelectDesign: (design: UserDesign) => void;
  onNewDesign: () => void;
  currentEditorState: DesignEditorState;
  designs: UserDesign[];
  loading: boolean;
  saveDesign: (id: string | null, title: string, editorState: DesignEditorState) => Promise<any>;
  deleteDesign: (id: string) => Promise<void>;
  onLockedEdit?: () => void;
}

export function AppSidebar({
  activeDesignId,
  onSelectDesign,
  onNewDesign,
  currentEditorState,
  designs,
  loading,
  saveDesign,
  deleteDesign,
  onLockedEdit,
}: AppSidebarProps) {
  const { user, signOut, isPro } = useAuth();
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  // Fetch what's new posts
  const [whatsNewPosts, setWhatsNewPosts] = useState<{ id: string; title: string; content: string; published_at: string | null }[]>([]);
  const [whatsNewOpen, setWhatsNewOpen] = useState(false);

  useEffect(() => {
    supabase
      .from("whats_new_posts")
      .select("id, title, content, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(5)
      .then(({ data }) => { if (data) setWhatsNewPosts(data); });
  }, []);

  const currentTier = isPro ? "Pro" : "Free";
  const { images: userImages, uploading: uploadingImage, uploadImage, deleteImage: deleteUserImage } = useUserImages();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    const text = (currentEditorState as any).quote || "";
    const title = text
      ? text.slice(0, 40) + (text.length > 40 ? "…" : "")
      : "Untitled";
    await saveDesign(activeDesignId, title, currentEditorState);
  };

  const handleLockedEdit = () => {
    if (onLockedEdit) {
      onLockedEdit();
      return;
    }

    navigate("/pricing");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-3 overflow-hidden">
        <div className="relative min-h-[26px]">
          {!collapsed && <LogoWithTagline />}
          <button
            onClick={() => toggleSidebar()}
            className={`absolute top-0 ${collapsed ? "left-1/2 -translate-x-1/2" : "right-0"} p-1 hover:bg-accent rounded-md transition-colors flex-shrink-0`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-muted-foreground" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
        {!collapsed && (
          <h2 className="font-heading text-sm font-semibold tracking-tight text-foreground truncate">
            My Content
          </h2>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onNewDesign} className="text-primary">
                  <Plus className="w-4 h-4" />
                  <span>New Content</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Saved Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {loading ? (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <span className="text-xs text-muted-foreground">Loading…</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : designs.length === 0 ? (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <span className="text-xs text-muted-foreground">No saved designs yet</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                designs.map((d) => (
                  <SidebarMenuItem key={d.id}>
                    <SidebarMenuButton
                      isActive={activeDesignId === d.id}
                      onClick={() => onSelectDesign(d)}
                      tooltip={d.title}
                    >
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{d.title}</span>
                    </SidebarMenuButton>
                    <div className="flex items-center">
                      {!isPro && activeDesignId === d.id && (
                        <SidebarMenuAction
                          showOnHover
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLockedEdit();
                          }}
                        >
                          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                        </SidebarMenuAction>
                      )}
                      <SidebarMenuAction
                        showOnHover
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDesign(d.id);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </SidebarMenuAction>
                    </div>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Image Library — Pro users */}
        {isPro && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>
                <FolderOpen className="w-3.5 h-3.5 mr-1.5" />
                My Images
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        await uploadImage(file);
                        e.target.value = "";
                      }}
                    />
                    <SidebarMenuButton
                      onClick={() => imageInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="text-primary"
                    >
                      {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                      <span>{uploadingImage ? "Uploading…" : "Upload Image"}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
                {!collapsed && userImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-1.5 px-2 pb-2 max-h-[200px] overflow-y-auto">
                    {userImages.map((img) => (
                      <div key={img.id} className="relative group aspect-square rounded-md overflow-hidden border border-border hover:border-foreground/30 transition-all">
                        <img src={img.file_url} alt={img.file_name} className="w-full h-full object-cover" loading="lazy" />
                        <button
                          onClick={() => deleteUserImage(img.id)}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-2.5 h-2.5 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {!collapsed && userImages.length === 0 && (
                  <p className="text-[10px] text-muted-foreground px-3 pb-2">Upload images to build your library.</p>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* What's New */}
        {whatsNewPosts.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                What's New
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {!collapsed && (
                  <div className="px-3 pb-2 space-y-2">
                    {(whatsNewOpen ? whatsNewPosts : whatsNewPosts.slice(0, 2)).map((post) => (
                      <div key={post.id} className="space-y-0.5">
                        <p className="text-xs font-heading font-medium text-foreground leading-tight">{post.title}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-snug">{post.content}</p>
                        {post.published_at && (
                          <p className="text-[9px] text-muted-foreground/60">{new Date(post.published_at).toLocaleDateString()}</p>
                        )}
                      </div>
                    ))}
                    {whatsNewPosts.length > 2 && (
                      <button
                        onClick={() => setWhatsNewOpen(!whatsNewOpen)}
                        className="text-[10px] text-primary hover:underline"
                      >
                        {whatsNewOpen ? "Show less" : `Show ${whatsNewPosts.length - 2} more`}
                      </button>
                    )}
                  </div>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />

        {!collapsed && (
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs font-heading font-medium text-foreground truncate">{currentTier} Plan</span>
            </div>
            <button
              onClick={() => navigate("/pricing")}
              className="flex items-center gap-2 w-full text-xs text-primary hover:underline"
            >
              <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{currentTier === "Free" ? "Upgrade plan" : "Manage subscription"}</span>
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2 w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">Settings</span>
            </button>
            <ContactDialog />
          </div>
        )}

        <SidebarSeparator />

        {!collapsed ? (
          <div className="p-3 flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <button
              onClick={signOut}
              className="p-1.5 hover:bg-accent rounded-md transition-colors flex-shrink-0"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="p-2 flex justify-center">
            <button
              onClick={signOut}
              className="p-1.5 hover:bg-accent rounded-md transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
