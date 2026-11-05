import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin CMS",
  robots: {
    index: false,
    follow: false,
  },
};

/* .admin-theme keeps the CMS on the original dark theme while the public
   site uses the light glass theme (see globals.css). */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="admin-theme min-h-screen [padding-top:var(--admin-safe-top)] pb-10">
      {children}
    </section>
  );
}
