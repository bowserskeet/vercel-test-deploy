import { Campaign, EmailSender } from "@prisma/client";
import { ContactDto } from "../../crm/services/CrmService";
import { CampaignWithDetails } from "../db/campaigns.db.server";
import { json } from "@remix-run/node";

export type EmailMarketingSummaryDto = {
  avgOpenRate: number;
  avgClickRate: number;
  outboundEmails: {
    sent: number;
    delivered: number;
  };
};
async function getSummary(_: string | null): Promise<EmailMarketingSummaryDto> {
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}

async function sendPreview(_data: {
  from: { tenantId: string | null; sender: EmailSender };
  email: { to: string; subject: string; htmlBody: string; textBody: string; track: true };
}): Promise<boolean> {
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}

async function sendContactPreview(_data: {
  contactRowId: string;
  from: { tenantId: string | null; sender: EmailSender };
  email: { to: string; subject: string; htmlBody: string; textBody: string; track: boolean };
}): Promise<boolean> {
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}

async function createCampaignDraft(_data: {
  name: string;
  contactViewId: string | undefined;
  from: { tenantId: string | null; sender: EmailSender };
  email: {
    subject: string;
    htmlBody: string;
    textBody: string | undefined;
    track: boolean;
  };
}): Promise<Campaign> {
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}

async function getContactMarketingSubscribersFromView(_data: { contactViewId: string | undefined; tenantId: string | null }): Promise<ContactDto[]> {
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}

async function sendCampaignTest(_campaign: CampaignWithDetails, _email: string): Promise<boolean> {
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}

async function sendCampaign(_campaign: CampaignWithDetails): Promise<boolean> {
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}

export default {
  getSummary,
  getContactMarketingSubscribersFromView,
  sendPreview,
  sendContactPreview,
  createCampaignDraft,
  sendCampaignTest,
  sendCampaign,
};
