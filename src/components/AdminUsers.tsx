import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Clock, Mail, Shield } from "lucide-react";

interface UserInfo {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  provider: string;
  confirmed: boolean;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await supabase.functions.invoke("list-users", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (response.data?.users) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return "Never";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground text-sm">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          Users ({users.length})
        </h2>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 font-heading font-medium text-muted-foreground text-xs uppercase tracking-widest">User</th>
              <th className="text-left px-4 py-3 font-heading font-medium text-muted-foreground text-xs uppercase tracking-widest">Plan</th>
              <th className="text-left px-4 py-3 font-heading font-medium text-muted-foreground text-xs uppercase tracking-widest">Provider</th>
              <th className="text-left px-4 py-3 font-heading font-medium text-muted-foreground text-xs uppercase tracking-widest">Joined</th>
              <th className="text-left px-4 py-3 font-heading font-medium text-muted-foreground text-xs uppercase tracking-widest">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.email}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{user.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-heading font-medium uppercase tracking-wider bg-muted text-muted-foreground">
                    Free
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-muted-foreground capitalize">{user.provider}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span title={formatDate(user.created_at)}>{timeAgo(user.created_at)}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-muted-foreground">
                    {user.last_sign_in_at ? timeAgo(user.last_sign_in_at) : "Never"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
