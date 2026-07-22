import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Nav from "@/components/Nav";

export default async function ProtectedLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken");

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="protected-layout">
      <Nav />
      <main>{children}</main>
    </div>
  );
}