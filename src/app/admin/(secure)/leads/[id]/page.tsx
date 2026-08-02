import { notFound } from "next/navigation";
import LeadWorkbenchClient from "@/components/admin/LeadWorkbenchClient";
import {
  getLeadById,
  getLatestGeneratedLeadPage,
  getLatestLeadAudit,
  getLatestLeadProposal,
  listPublishedPackagesForLeads,
  listPublishedServicesForLeads,
} from "@/lib/leads/repository";

export default async function LeadWorkbenchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  const [latestAudit, latestPage, latestProposal, packages, services] = await Promise.all([
    getLatestLeadAudit(lead.id),
    getLatestGeneratedLeadPage(lead.id),
    getLatestLeadProposal(lead.id),
    listPublishedPackagesForLeads(),
    listPublishedServicesForLeads(),
  ]);

  return (
    <LeadWorkbenchClient
      lead={lead}
      latestAudit={latestAudit}
      latestPage={latestPage}
      latestProposal={latestProposal}
      packages={packages}
      services={services}
    />
  );
}
