import { forwardAuthRequest } from "./_proxy";

export default async function handler(req: any, res: any) {
  await forwardAuthRequest(req, res, "/auth/sign-up");
}
