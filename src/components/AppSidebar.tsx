import { Plus, FileText, Trash2, Crown, LogOut, CreditCard, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { UserDesign } from "@/hooks/useUserDesigns";
import type { DesignEditorState } from "@/components/DesignEditor";
import { LogoWithTagline } from "@/components/MainNav";
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
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const currentTier = "Free"; // TODO: check actual subscription

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
      <SidebarHeader className="p-3 space-y-3 overflow-hidden">
        {!collapsed && <LogoWithTagline />}
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

              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSave} className="text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>{activeDesignId ? "Save changes" : "Save content"}</span>
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
                      {!isPro && (
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
          </div>
        )}

        <SidebarSeparator />

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
      </SidebarFooter>
    </Sidebar>
  );
}
