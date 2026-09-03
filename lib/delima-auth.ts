import { OAuth2Client } from "google-auth-library";

export type DelimaIdentity = {
  subject: string;
  name: string;
  email: string;
};

let googleClient: OAuth2Client | undefined;

export async function verifyDelimaCredential(credential: string): Promise<DelimaIdentity> {
  const clientId = process.env.GOOGLE_CLIENT_ID ?? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error("DELIMA_NOT_CONFIGURED");
  if (!googleClient) googleClient = new OAuth2Client(clientId);

  const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: clientId });
  const payload = ticket.getPayload();
  const email = String(payload?.email ?? "").trim().toLowerCase();
  const name = String(payload?.name ?? payload?.given_name ?? "Murid DELIMa").trim().slice(0, 60);

  if (!payload?.sub || payload.email_verified !== true || !email.endsWith("@moe-dl.edu.my")) {
    throw new Error("DELIMA_ACCOUNT_REQUIRED");
  }

  return { subject: payload.sub, name, email };
}
