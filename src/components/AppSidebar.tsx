import { Plus, FileText, Trash2, Crown, ChevronUp, LogOut, CreditCard, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { UserQuote } from "@/hooks/useUserQuotes";
import type { QuoteEditorState } from "@/components/QuoteEditor";
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
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  activeQuoteId: string | null;
  onSelectQuote: (quote: UserQuote) => void;
  onNewQuote: () => void;
  currentEditorState: QuoteEditorState;
  quotes: UserQuote[];
  loading: boolean;
  saveQuote: (id: string | null, title: string, editorState: QuoteEditorState) => Promise<any>;
  deleteQuote: (id: string) => Promise<void>;
}

export function AppSidebar({ activeQuoteId, onSelectQuote, onNewQuote, currentEditorState, quotes, loading, saveQuote, deleteQuote }: AppSidebarProps) {
  const { user, signOut, isPro } = useAuth();
  const navigate = useNavigate();

  const currentTier = "Free"; // TODO: check actual subscription

  const handleSave = async () => {
    const title = currentEditorState.quote
      ? currentEditorState.quote.slice(0, 40) + (currentEditorState.quote.length > 40 ? "…" : "")
      : "Untitled";
    await saveQuote(activeQuoteId, title, currentEditorState);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-3">
        <h2 className="font-heading text-sm font-semibold tracking-tight text-foreground truncate">
          My Content
        </h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* New Quote */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onNewQuote} className="text-primary">
                  <Plus className="w-4 h-4" />
                  <span>New Content</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Save current */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSave} className="text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>{activeQuoteId ? "Save changes" : "Save content"}</span>
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
              ) : quotes.length === 0 ? (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <span className="text-xs text-muted-foreground">No saved designs yet</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                quotes.map((q) => (
                  <SidebarMenuItem key={q.id}>
                    <SidebarMenuButton
                      isActive={activeQuoteId === q.id}
                      onClick={() => onSelectQuote(q)}
                      tooltip={q.title}
                    >
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{q.title}</span>
                    </SidebarMenuButton>
                    <div className="flex items-center">
                      {!isPro && (
                        <SidebarMenuAction
                          showOnHover
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.info("Upgrade to Pro to edit your saved designs", {
                              action: {
                                label: "Upgrade",
                                onClick: () => navigate("/pricing"),
                              },
                            });
                          }}
                        >
                          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                        </SidebarMenuAction>
                      )}
                      <SidebarMenuAction
                        showOnHover
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteQuote(q.id);
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

        {/* Subscription tier */}
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-heading font-medium text-foreground">{currentTier} Plan</span>
          </div>
          <button
            onClick={() => navigate("/pricing")}
            className="flex items-center gap-2 w-full text-xs text-primary hover:underline"
          >
            <CreditCard className="w-3.5 h-3.5" />
            {currentTier === "Free" ? "Upgrade plan" : "Manage subscription"}
          </button>
        </div>

        <SidebarSeparator />

        {/* User info + sign out */}
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
