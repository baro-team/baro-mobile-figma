type ApiRequest = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  status: (statusCode: number) => ApiResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
  send: (body: string) => void;
};

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function serializeRequestBody(body: unknown) {
  if (typeof body === "string") {
    return body;
  }

  if (body instanceof Uint8Array) {
    return new TextDecoder().decode(body);
  }

  return JSON.stringify(body);
}

function getAuthorizationHeader(req: ApiRequest) {
  const authorization = req.headers?.authorization;

  return Array.isArray(authorization) ? authorization[0] : authorization;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const backendBaseUrl = process.env.BACKEND_BASE_URL;

  if (!backendBaseUrl) {
    res.status(500).json({
      message: "BACKEND_BASE_URL이 설정되지 않았습니다.",
    });
    return;
  }

  const targetUrl = `${normalizeBaseUrl(backendBaseUrl)}/dispatch/pre`;

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        Accept: "*/*",
        ...(getAuthorizationHeader(req)
          ? { Authorization: getAuthorizationHeader(req) }
          : {}),
        "Content-Type": "application/json",
      },
      body: serializeRequestBody(req.body),
    });

    const responseText = await upstreamResponse.text();
    const contentType =
      upstreamResponse.headers.get("content-type") ?? "application/json";

    res.status(upstreamResponse.status);
    res.setHeader("Content-Type", contentType);
    res.send(responseText);
  } catch (error) {
    res.status(502).json({
      message:
        error instanceof Error
          ? error.message
          : "사전 배차 프록시 호출 중 오류가 발생했습니다.",
    });
  }
}
