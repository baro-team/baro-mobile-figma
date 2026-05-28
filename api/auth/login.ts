import { ApiRequest, ApiResponse, forwardAuthRequest } from "./_proxy";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  await forwardAuthRequest(req, res, "/auth/login");
}
