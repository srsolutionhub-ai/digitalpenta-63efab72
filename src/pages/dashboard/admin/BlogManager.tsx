import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, X, Save } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: string | null;
  author: string | null;
  categories: string[] | null;
  tags: string[] | null;
  featured_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string | null;
  views_count: number | null;
}

const emptyPost = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  status: "draft",
  author: "",
  categories: "",
  tags: "",
  featured_image: "",
  seo_title: "",
  seo_description: "",
};

export default function BlogManager() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyPost);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      // Fetch all posts (including drafts) - RLS allows authenticated users
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (isNew: boolean) => {
      const payload = {
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        excerpt: form.excerpt || null,
        content: form.content,
        status: form.status,
        author: form.author || null,
        categories: form.categories ? form.categories.split(",").map((s) => s.trim()) : null,
        tags: form.tags ? form.tags.split(",").map((s) => s.trim()) : null,
        featured_image: form.featured_image || null,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        published_at: form.status === "published" ? new Date().toISOString() : null,
      };

      if (isNew) {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
      } else if (editing) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", editing.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(creating ? "Post created" : "Post updated");
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      setEditing(null);
      setCreating(false);
      setForm(emptyPost);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setCreating(false);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      status: post.status || "draft",
      author: post.author || "",
      categories: post.categories?.join(", ") || "",
      tags: post.tags?.join(", ") || "",
      featured_image: post.featured_image || "",
      seo_title: post.seo_title || "",
      seo_description: post.seo_description || "",
    });
  };

  const openCreate = () => {
    setEditing(null);
    setCreating(true);
    setForm(emptyPost);
  };

  const closeForm = () => {
    setEditing(null);
    setCreating(false);
    setForm(emptyPost);
  };

  const showForm = editing || creating;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-foreground">Blog Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">{posts?.length ?? 0} posts</p>
        </div>
        {!showForm && (
          <Button onClick={openCreate} size="sm">
            <Plus className="w-4 h-4 mr-1" /> New Post
          </Button>
        )}
      </div>

      {showForm && (
        <div className="border border-border/30 rounded-xl p-6 space-y-4 bg-card">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-foreground">
              {creating ? "New Post" : "Edit Post"}
            </h2>
            <button onClick={closeForm} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated-from-title" />
            </div>
            <div className="space-y-2">
              <Label>Author</Label>
              <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author name" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Categories (comma separated)</Label>
              <Input value={form.categories} onChange={(e) => setForm({ ...form, categories: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Featured Image URL</Label>
              <Input value={form.featured_image} onChange={(e) => setForm({ ...form, featured_image: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Excerpt</Label>
              <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Content</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12} className="font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <Label>SEO Title</Label>
              <Input value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>SEO Description</Label>
              <Input value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={() => saveMutation.mutate(creating)} disabled={saveMutation.isPending || !form.title || !form.content}>
              <Save className="w-4 h-4 mr-1" /> {creating ? "Create" : "Save"}
            </Button>
            <Button variant="outline" onClick={closeForm}>Cancel</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="border border-border/20 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20 bg-muted/20">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Author</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Views</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts?.map((post) => (
                <tr key={post.id} className="border-b border-border/10 hover:bg-muted/10">
                  <td className="px-4 py-3 text-foreground font-medium">{post.title}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      post.status === "published" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{post.author || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{post.views_count ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => window.open(`/blog/${post.slug}`, "_blank")} className="p-1.5 text-muted-foreground hover:text-foreground">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEdit(post)} className="p-1.5 text-muted-foreground hover:text-primary">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { if (confirm("Delete this post?")) deleteMutation.mutate(post.id); }}
                        className="p-1.5 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No blog posts yet. Create your first one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
