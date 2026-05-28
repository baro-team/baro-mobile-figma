import {
  BaseApiResponse,
  PreDispatchPreview,
  PreDispatchRequest,
  PreDispatchResponse,
  PreDispatchResponseData,
} from "../model/pre-dispatch-types";

function isBaseResponse(
  response: PreDispatchResponse,
): response is BaseApiResponse<PreDispatchResponseData> {
  return "success" in response;
}

function unwrapPreDispatchResponse(
  response: PreDispatchResponse,
): PreDispatchResponseData {
  if (!isBaseResponse(response)) {
    return response;
  }

  if (!response.success || !response.data) {
    throw new Error(
      response.error?.message ||
        response.message ||
        "사전 배차 예상 응답을 확인할 수 없습니다.",
    );
  }

  return response.data;
}

export async function requestPreDispatch(
  payload: PreDispatchRequest,
  accessToken: string,
  signal?: AbortSignal,
): Promise<PreDispatchPreview> {
  const response = await fetch("/api/dispatch/pre", {
    method: "POST",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error("사전 배차 예상 정보를 불러오지 못했습니다.");
  }

  const data = unwrapPreDispatchResponse(
    (await response.json()) as PreDispatchResponse,
  );

  const requestId = data.requestId ?? data.request_id;
  const routePath = data.routePath ?? data.route_path;
  const estimatedTime = data.estimatedTime ?? data.estimated_time;
  const distanceKm = data.distanceKm ?? data.distance_km;

  if (
    requestId == null ||
    !routePath ||
    estimatedTime == null ||
    distanceKm == null
  ) {
    throw new Error("사전 배차 예상 응답 형식이 올바르지 않습니다.");
  }

  return {
    requestId,
    fare: data.fare,
    routePath,
    estimatedTime,
    distanceKm,
    origin: payload.origin,
    destination: payload.destination,
  };
}
