import {
  DispatchRequest,
  DispatchResponse,
  DispatchResult,
} from "../model/pre-dispatch-types";

function unwrapDispatchResponse(response: DispatchResponse): DispatchResult {
  const data = "success" in response ? response.data : response;

  if ("success" in response) {
    if (!response.success || !response.data) {
      throw new Error(
        response.error?.message ||
          response.message ||
          "배차 요청 응답을 확인할 수 없습니다.",
      );
    }

  }

  if (!data) {
    throw new Error("배차 요청 응답을 확인할 수 없습니다.");
  }

  const dispatchId = data.dispatchId ?? data.dispatch_id;
  const requestId = data.requestId ?? data.request_id;
  const userId = data.userId ?? data.user_id;
  const carId = data.carId ?? data.car_id ?? 0;
  const standId = data.standId ?? data.stand_id ?? 0;
  const estimatedPickupTime =
    data.estimatedPickupTime ?? data.estimated_pickup_time ?? 0;
  const estimatedRideTime = data.estimatedRideTime ?? data.estimated_ride_time;
  const pickupRoutePath = data.pickupRoutePath ?? data.pickup_route_path ?? [];
  const dropoffRoutePath =
    data.dropoffRoutePath ?? data.dropoff_route_path ?? [];
  const dispatchStatus = data.dispatchStatus ?? data.dispatch_status;

  if (!dispatchId || !requestId || !userId || !estimatedRideTime || !dispatchStatus) {
    throw new Error("배차 요청 응답 형식이 올바르지 않습니다.");
  }

  return {
    dispatchId,
    requestId,
    userId,
    carId,
    standId,
    estimatedPickupTime,
    estimatedRideTime,
    pickupRoutePath,
    dropoffRoutePath,
    fare: data.fare,
    dispatchStatus,
  };
}

export async function requestDispatch(
  payload: DispatchRequest,
  accessToken: string,
): Promise<DispatchResult> {
  const response = await fetch("/api/dispatch", {
    method: "POST",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data: DispatchResponse | null = null;

  try {
    data = (await response.json()) as DispatchResponse;
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (data && "success" in data) {
      throw new Error(
        data.error?.message || data.message || "배차 요청에 실패했습니다.",
      );
    }

    throw new Error("배차 요청에 실패했습니다.");
  }

  if (!data) {
    throw new Error("배차 요청 응답을 확인할 수 없습니다.");
  }

  return unwrapDispatchResponse(data);
}
