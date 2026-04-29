import {
  PreDispatchPreview,
  PreDispatchRequest,
  PreDispatchResponse,
} from "../model/pre-dispatch-types";

export async function requestPreDispatch(
  payload: PreDispatchRequest,
  signal?: AbortSignal,
): Promise<PreDispatchPreview> {
  const response = await fetch("/api/dispatch/pre", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error("사전 배차 예상 정보를 불러오지 못했습니다.");
  }

  const data = (await response.json()) as PreDispatchResponse;

  return {
    requestId: data.request_id,
    fare: data.fare,
    routePath: data.route_path,
    estimatedTime: data.estimated_time,
    distanceKm: data.distance_km,
    origin: payload.origin,
    destination: payload.destination,
  };
}
