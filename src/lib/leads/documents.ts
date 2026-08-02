import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import type { LeadProposalRecord } from "@/lib/leads/types";

export type ProposalDocumentKind = "proposal" | "agreement";

type DocumentBlock = {
  text: string;
  style: "title" | "subtitle" | "heading" | "body" | "bullet" | "label" | "spacer";
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatPercent(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function scopeSentence(proposal: LeadProposalRecord): string {
  return proposal.selected_items
    .map((item) => {
      const deliverables = item.deliverables.length > 0
        ? `, including ${item.deliverables.join(", ")}`
        : "";
      return `${item.name}${deliverables}`;
    })
    .join("; ");
}

function proposalBlocks(proposal: LeadProposalRecord): DocumentBlock[] {
  const deposit = proposal.total * (proposal.deposit_percent / 100);
  const balance = proposal.total - deposit;

  return [
    { style: "label", text: "CREATIVE AGENCY - OHIO" },
    { style: "title", text: "Project Proposal" },
    { style: "subtitle", text: proposal.title },
    { style: "spacer", text: "" },
    { style: "label", text: `PREPARED FOR  ${proposal.prepared_for}` },
    { style: "label", text: `ATTN  ${proposal.contact_name || "Client"}` },
    { style: "label", text: "PREPARED BY  Foundry Frame LLC - James Latten, Creative Director" },
    { style: "label", text: `DATE  ${formatDate(proposal.created_at.slice(0, 10))}` },
    { style: "heading", text: "The Opportunity" },
    { style: "body", text: proposal.proposal_content.opportunity },
    { style: "heading", text: "What We Recommend" },
    { style: "body", text: proposal.proposal_content.recommendation },
    { style: "heading", text: "Project Objectives" },
    ...proposal.proposal_content.objectives.map((text) => ({ style: "bullet" as const, text })),
    { style: "heading", text: "Scope & Deliverables" },
    { style: "body", text: proposal.proposal_content.scopeSummary },
    ...proposal.selected_items.flatMap((item) => [
      { style: "subtitle" as const, text: item.name },
      ...(item.description ? [{ style: "body" as const, text: item.description }] : []),
      ...item.deliverables.map((text) => ({ style: "bullet" as const, text })),
    ]),
    { style: "heading", text: "Investment" },
    ...proposal.selected_items.map((item) => ({
      style: "body" as const,
      text: `${item.name}: ${money.format(item.price)}`,
    })),
    ...(proposal.discount > 0
      ? [{ style: "body" as const, text: `Discount: -${money.format(proposal.discount)}` }]
      : []),
    { style: "subtitle", text: `Total Investment: ${money.format(proposal.total)}` },
    { style: "heading", text: "Payment Terms" },
    {
      style: "body",
      text: `A ${formatPercent(proposal.deposit_percent)}% deposit (${money.format(deposit)}) reserves the project slot and begins discovery. The remaining balance (${money.format(balance)}) is due prior to launch and transfer of final deliverables.`,
    },
    { style: "heading", text: "Timeline" },
    ...proposal.proposal_content.timeline.flatMap((phase) => [
      { style: "subtitle" as const, text: `${phase.name} - ${phase.weeks}` },
      { style: "body" as const, text: phase.description },
    ]),
    {
      style: "body",
      text: `Estimated ${proposal.timeline_weeks} weeks from kickoff, contingent on timely feedback and content delivery.`,
    },
    { style: "heading", text: "Next Steps" },
    { style: "body", text: proposal.proposal_content.nextSteps },
    {
      style: "body",
      text: `This proposal is valid through ${formatDate(proposal.valid_until)}. Review the accompanying Service Agreement before signing or paying a deposit.`,
    },
    { style: "spacer", text: "" },
    { style: "subtitle", text: "Foundry Frame LLC" },
    { style: "body", text: "(440) 921-8245  |  jlatten@foundryframe.com  |  foundryframe.com" },
    { style: "label", text: "DRAFT - REVIEW BEFORE SENDING" },
  ];
}

function agreementBlocks(proposal: LeadProposalRecord): DocumentBlock[] {
  const effectiveDate = formatDate(proposal.created_at.slice(0, 10));
  const deposit = proposal.total * (proposal.deposit_percent / 100);
  const balance = proposal.total - deposit;
  const scope = scopeSentence(proposal);

  return [
    { style: "label", text: "FOUNDRY FRAME" },
    { style: "title", text: "Services Agreement" },
    { style: "subtitle", text: `Effective Date: ${effectiveDate}` },
    {
      style: "body",
      text: `This Services Agreement (the "Agreement") is entered into as of the Effective Date above, by and between Foundry Frame LLC, an Ohio limited liability company with a principal place of business in Lorain, Ohio ("Foundry Frame"), and ${proposal.prepared_for} ("Client"). Foundry Frame and Client are each a "Party" and together the "Parties." This Agreement incorporates by reference the Proposal delivered to Client dated ${effectiveDate} (the "Proposal").`,
    },
    { style: "heading", text: "1. Scope of Services" },
    {
      style: "body",
      text: `Foundry Frame will provide the following services: ${scope}. Any work not described in the Proposal is out of scope and will be handled under Section 4 (Change Requests).`,
    },
    { style: "heading", text: "2. Fees & Payment Terms" },
    {
      style: "body",
      text: `The total fee for the Services is ${money.format(proposal.total)}. A deposit of ${money.format(deposit)} (${formatPercent(proposal.deposit_percent)}%) is due upon execution of this Agreement and reserves Client's project slot; work begins upon receipt. The remaining balance of ${money.format(balance)} is due prior to launch and transfer of final deliverables. Invoices are payable within seven (7) days of receipt; amounts unpaid after that period accrue a late fee of 1.5% per month or the maximum permitted by Ohio law, whichever is lower. Deposits are non-refundable once Foundry Frame has begun work.`,
    },
    { style: "heading", text: "3. Timeline" },
    {
      style: "body",
      text: `Foundry Frame estimates a ${proposal.timeline_weeks} week delivery timeline from the kickoff date. This estimate assumes Client provides feedback and requested content or assets within five (5) business days of each request. Delays in Client feedback or content delivery will extend the timeline accordingly and are not a breach of this Agreement by Foundry Frame.`,
    },
    { style: "heading", text: "4. Revisions & Change Requests" },
    {
      style: "body",
      text: "The Services include the revision rounds expressly listed in the Proposal. Additional revisions or work outside the approved scope will be billed at Foundry Frame's standard rate of $125/hour and performed only after Client's written approval of the estimated additional cost.",
    },
    { style: "heading", text: "5. Client Responsibilities" },
    {
      style: "body",
      text: "Client will provide timely feedback, final copy, images, and brand assets, and will grant Foundry Frame the access reasonably required to complete the Services, including hosting, domain registrar, and analytics accounts as applicable. Client-caused delays may extend the timeline under Section 3.",
    },
    { style: "heading", text: "6. Ownership & Intellectual Property" },
    {
      style: "body",
      text: "Upon payment in full, Client owns the final design, custom code, and content created specifically for Client under this Agreement. Foundry Frame retains ownership of its pre-existing tools, frameworks, code libraries, and reusable components, and grants Client a perpetual, non-exclusive license to use them as incorporated into the deliverables. Foundry Frame may display the completed work in its portfolio and marketing unless Client requests otherwise in writing.",
    },
    { style: "heading", text: "7. Confidentiality" },
    {
      style: "body",
      text: "Each Party will keep confidential any non-public business, technical, or financial information disclosed by the other Party in connection with this Agreement and will use it only to perform its obligations under this Agreement.",
    },
    { style: "heading", text: "8. Warranties & Limitation of Liability" },
    {
      style: "body",
      text: "Foundry Frame will perform the Services in a professional and workmanlike manner consistent with industry standards. Except as expressly stated in this Agreement, the Services are provided without warranties of any kind, express or implied. Foundry Frame's total liability arising out of this Agreement will not exceed the total fees paid by Client, and Foundry Frame will not be liable for indirect, incidental, or consequential damages.",
    },
    { style: "heading", text: "9. Termination" },
    {
      style: "body",
      text: "Either Party may terminate this Agreement upon fourteen (14) days' written notice. Upon termination, Client will pay Foundry Frame for all Services performed through the effective date of termination. Deposits paid are non-refundable once work has begun.",
    },
    { style: "heading", text: "10. Independent Contractor" },
    {
      style: "body",
      text: "Foundry Frame is an independent contractor. Nothing in this Agreement creates an employment, partnership, or joint-venture relationship between the Parties.",
    },
    { style: "heading", text: "11. Governing Law" },
    {
      style: "body",
      text: "This Agreement is governed by the laws of the State of Ohio, without regard to conflict-of-law principles. Any disputes arising under this Agreement will be resolved in the state or federal courts located in Lorain County, Ohio.",
    },
    { style: "heading", text: "12. Entire Agreement & Amendments" },
    {
      style: "body",
      text: "This Agreement, together with the Proposal it incorporates, constitutes the entire agreement between the Parties regarding the Services and supersedes all prior discussions or agreements. Any amendment must be made in writing and signed by both Parties.",
    },
    { style: "heading", text: "13. Signatures" },
    { style: "body", text: "By signing below, each Party agrees to the terms of this Agreement." },
    { style: "spacer", text: "" },
    { style: "subtitle", text: "Foundry Frame LLC" },
    { style: "body", text: "Signature: ____________________________________" },
    { style: "body", text: "Printed Name: James Latten" },
    { style: "body", text: "Title: Creative Director" },
    { style: "body", text: "Date: ________________________________________" },
    { style: "spacer", text: "" },
    { style: "subtitle", text: proposal.prepared_for },
    { style: "body", text: "Signature: ____________________________________" },
    { style: "body", text: "Printed Name: _________________________________" },
    { style: "body", text: "Title: ________________________________________" },
    { style: "body", text: "Date: ________________________________________" },
    { style: "label", text: "DRAFT - REVIEW WITH QUALIFIED COUNSEL BEFORE USE" },
  ];
}

function getBlocks(proposal: LeadProposalRecord, kind: ProposalDocumentKind): DocumentBlock[] {
  return kind === "proposal" ? proposalBlocks(proposal) : agreementBlocks(proposal);
}

export async function renderDocx(
  proposal: LeadProposalRecord,
  kind: ProposalDocumentKind
): Promise<Uint8Array> {
  const paragraphs = getBlocks(proposal, kind).map((block) => {
    if (block.style === "spacer") return new Paragraph({ text: "" });
    if (block.style === "title") {
      return new Paragraph({
        heading: HeadingLevel.TITLE,
        spacing: { before: 180, after: 180 },
        children: [new TextRun({ text: block.text, bold: true, color: "111111", size: 42 })],
      });
    }
    if (block.style === "heading") {
      return new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 100 },
        children: [new TextRun({ text: block.text, bold: true, color: "111111", size: 28 })],
      });
    }
    if (block.style === "subtitle") {
      return new Paragraph({
        spacing: { before: 100, after: 100 },
        children: [new TextRun({ text: block.text, bold: true, color: "222222", size: 24 })],
      });
    }
    if (block.style === "label") {
      return new Paragraph({
        spacing: { before: 80, after: 80 },
        children: [new TextRun({ text: block.text, bold: true, color: "666666", size: 18 })],
      });
    }
    return new Paragraph({
      bullet: block.style === "bullet" ? { level: 0 } : undefined,
      spacing: { after: 120, line: 300 },
      children: [new TextRun({ text: block.text, color: "333333", size: 21 })],
    });
  });

  const document = new Document({
    creator: "Foundry Frame LLC",
    title: kind === "proposal" ? proposal.title : `${proposal.prepared_for} Services Agreement`,
    description: "Draft generated by the Foundry Frame proposal workbench.",
    sections: [
      {
        properties: {
          page: {
            margin: { top: 900, right: 900, bottom: 900, left: 900 },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "FOUNDRY FRAME", bold: true, size: 18, color: "777777" })],
          }),
          ...paragraphs,
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(document);
  return new Uint8Array(buffer);
}