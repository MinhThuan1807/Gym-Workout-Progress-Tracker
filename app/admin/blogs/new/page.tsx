import { BlogForm } from "@/components/admin/pages/BlogForm";

export const metadata = {
  title: "Create Blog Post | FitTrack Admin",
  description: "Create a new blog post",
};

export default function NewBlogPage() {
  return <BlogForm />;
}
