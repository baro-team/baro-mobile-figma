type ApiRequest = {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  status: (statusCode: number) => ApiResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
  send: (body: string) => void;
};

function getQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const kakaoRestApiKey = process.env.KAKAO_REST_API_KEY;

  if (!kakaoRestApiKey) {
    res
      .status(500)
      .json({ message: "KAKAO_REST_API_KEY 환경 변수가 설정되지 않았습니다." });
    return;
  }

  const query = getQueryValue(req.query?.query)?.trim();

  if (!query) {
    res.status(400).json({ message: "장소 검색어를 입력해주세요." });
    return;
  }

  const searchParams = new URLSearchParams({
    query,
    size: getQueryValue(req.query?.size) ?? "5",
  });

  try {
    const upstreamResponse = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `KakaoAK ${kakaoRestApiKey}`,
        },
      },
    );

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
          : "장소 검색 프록시 호출 중 오류가 발생했습니다.",
    });
  }
}
