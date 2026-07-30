import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin CMS",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen [padding-top:var(--admin-safe-top)] pb-10">
      {children}
    </section>
  );
}
