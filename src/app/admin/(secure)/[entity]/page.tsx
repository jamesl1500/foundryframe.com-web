import { notFound } from "next/navigation";
import CmsListClient from "@/components/admin/CmsListClient";
import { isCmsEntity } from "@/lib/cms/config";
import { getCmsItems } from "@/lib/cms/admin-data";

export default async function CmsEntityListPage({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {
  const { entity } = await params;

  if (!isCmsEntity(entity)) {
    notFound();
  }

  const items = await getCmsItems(entity);

  return <CmsListClient entity={entity} initialItems={items} />;
}
