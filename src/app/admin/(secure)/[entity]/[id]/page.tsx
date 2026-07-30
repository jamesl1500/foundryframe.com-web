import { notFound } from "next/navigation";
import CmsEditorClient from "@/components/admin/CmsEditorClient";
import { isCmsEntity } from "@/lib/cms/config";
import { getCmsItemById } from "@/lib/cms/admin-data";

export default async function CmsEntityEditPage({
  params,
}: {
  params: Promise<{ entity: string; id: string }>;
}) {
  const { entity, id } = await params;

  if (!isCmsEntity(entity)) {
    notFound();
  }

  const item = await getCmsItemById(entity, id);

  if (!item) {
    notFound();
  }

  return <CmsEditorClient entity={entity} mode="edit" id={id} initialItem={item} />;
}
