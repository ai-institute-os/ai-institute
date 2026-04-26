import { redirect } from "next/navigation";

// Public root redirects to admin screening tool
export default function HomePage() {
  redirect("/admin/screen");
}
