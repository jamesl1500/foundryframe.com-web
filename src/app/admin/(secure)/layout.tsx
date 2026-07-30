import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdminUser } from "@/lib/admin-auth";
import { CMS_ENTITIES } from "@/lib/cms/types";
import { CMS_CONFIG } from "@/lib/cms/config";
import AdminSignOutButton from "@/components/admin/AdminSignOutButton";

export default async function SecureAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminUser = await getCurrentAdminUser();

  if (!adminUser) {
    redirect("/admin/login");
  }

  return (
    <div className="bg-black">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-2 pb-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2">Admin</p>
            <h2 className="text-2xl font-heading font-bold text-white">Foundry Frame CMS</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              {adminUser.role}
            </span>
            <AdminSignOutButton />
          </div>
        </div>

        <nav className="flex flex-wrap gap-2 pt-5 pb-4 border-b border-white/10">
          <Link href="/admin" className="px-3 py-2 border border-white/20 text-[10px] uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5">
            Dashboard
          </Link>
          <Link
            href="/admin/leads"
            className="px-3 py-2 border border-emerald-300/30 text-[10px] uppercase tracking-widest text-emerald-200 hover:text-white hover:bg-emerald-500/10"
          >
            Leads AI Generator
          </Link>
          {CMS_ENTITIES.map((entity) => (
            <Link
              key={entity}
              href={`/admin/${entity}`}
              className="px-3 py-2 border border-white/20 text-[10px] uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5"
            >
              {CMS_CONFIG[entity].label}
            </Link>
          ))}
        </nav>
      </div>

      {children}
    </div>
  );
}
