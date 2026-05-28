import { forwardAuthRequest } from "./_proxy";
import type { ApiRequest, ApiResponse } from "./_proxy";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  await forwardAuthRequest(req, res, "/auth/login");
}
