function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

export async function forwardAuthRequest(req: any, res: any, authPath: string) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const authBaseUrl =
    process.env.AUTH_BASE_URL ||
    process.env.VITE_AUTH_API_BASE_URL ||
    "http://baro-dev-1701378146.ap-northeast-2.elb.amazonaws.com";

  const targetUrl = `${normalizeBaseUrl(authBaseUrl)}${authPath}`;

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
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
          : "인증 프록시 호출 중 오류가 발생했습니다.",
    });
  }
}
