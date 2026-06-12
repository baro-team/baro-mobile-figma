type ApiRequest = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  status: (statusCode: number) => ApiResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
  send: (body: string) => void;
  write: (chunk: Uint8Array) => void;
  end: () => void;
};

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function serializeRequestBody(body: unknown) {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (typeof body === "string") {
    return body;
  }

  if (body instanceof Uint8Array) {
    return new TextDecoder().decode(body);
  }

  return JSON.stringify(body);
}

function getHeader(req: ApiRequest, name: string) {
  const value = req.headers?.[name] ?? req.headers?.[name.toLowerCase()];

  return Array.isArray(value) ? value[0] : value;
}

function getProxyPath(req: ApiRequest) {
  const path = req.query?.path;
  const segments = Array.isArray(path) ? path : path ? [path] : [];

  return segments.map(encodeURIComponent).join("/");
}

async function streamResponse(upstreamResponse: Response, res: ApiResponse) {
  if (!upstreamResponse.body) {
    res.end();
    return;
  }

  const reader = upstreamResponse.body.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) res.write(value);
    }
  } finally {
    res.end();
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const backendBaseUrl = process.env.BACKEND_BASE_URL;

  if (!backendBaseUrl) {
    res.status(500).json({
      message: "BACKEND_BASE_URL이 설정되지 않았습니다.",
    });
    return;
  }

  const method = req.method ?? "GET";
  const proxyPath = getProxyPath(req);

  if (!proxyPath) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  const targetUrl = `${normalizeBaseUrl(backendBaseUrl)}/dispatch/${proxyPath}`;

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method,
      headers: {
        Accept: getHeader(req, "accept") ?? "*/*",
        ...(getHeader(req, "authorization")
          ? { Authorization: getHeader(req, "authorization") }
          : {}),
        ...(method !== "GET" && method !== "HEAD"
          ? { "Content-Type": getHeader(req, "content-type") ?? "application/json" }
          : {}),
      },
      body: method === "GET" || method === "HEAD" ? undefined : serializeRequestBody(req.body),
    });

    const contentType = upstreamResponse.headers.get("content-type") ?? "application/json";

    res.status(upstreamResponse.status);
    res.setHeader("Content-Type", contentType);

    if (contentType.includes("text/event-stream")) {
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      await streamResponse(upstreamResponse, res);
      return;
    }

    res.send(await upstreamResponse.text());
  } catch (error) {
    res.status(502).json({
      message:
        error instanceof Error
          ? error.message
          : "배차 프록시 호출 중 오류가 발생했습니다.",
    });
  }
}
