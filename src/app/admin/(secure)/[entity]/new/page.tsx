import { notFound } from "next/navigation";
import CmsEditorClient from "@/components/admin/CmsEditorClient";
import { isCmsEntity } from "@/lib/cms/config";

export default async function CmsEntityCreatePage({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {
  const { entity } = await params;

  if (!isCmsEntity(entity)) {
    notFound();
  }

  return <CmsEditorClient entity={entity} mode="create" />;
}
