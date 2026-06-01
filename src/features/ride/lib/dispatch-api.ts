import {
  BaseApiResponse,
  DispatchRequest,
  DispatchResponse,
  DispatchResponseData,
  DispatchResult,
} from "../model/pre-dispatch-types";
import { ErrorResponse, getErrorMessage } from "./api-error";

function isBaseDispatchResponse(
  response: DispatchResponse,
): response is BaseApiResponse<DispatchResponseData> {
  return "success" in response;
}

function unwrapDispatchResponse(response: DispatchResponse): DispatchResult {
  const isBaseResponse = isBaseDispatchResponse(response);

  if (isBaseResponse) {
    if (!response.success || !response.data) {
      throw new Error(
        response.error?.message ||
          response.message ||
          "배차 요청 응답을 확인할 수 없습니다.",
      );
    }
  }

  const data = isBaseResponse ? response.data : response;

  if (!data) {
    throw new Error("배차 요청 응답을 확인할 수 없습니다.");
  }

  const dispatchId = data.dispatchId ?? data.dispatch_id;
  const requestId = data.requestId ?? data.request_id;
  const userId = data.userId ?? data.user_id;
  const carId = data.carId ?? data.car_id ?? 0;
  const standId = data.standId ?? data.stand_id ?? 0;
  const estimatedPickupTime =
    data.estimatedPickupTime ?? data.estimated_pickup_time;
  const estimatedRideTime = data.estimatedRideTime ?? data.estimated_ride_time;
  const pickupRoutePath = data.pickupRoutePath ?? data.pickup_route_path ?? [];
  const dropoffRoutePath =
    data.dropoffRoutePath ?? data.dropoff_route_path ?? [];
  const dispatchStatus = data.dispatchStatus ?? data.dispatch_status;

  if (
    dispatchId == null ||
    requestId == null ||
    userId == null ||
    estimatedRideTime == null ||
    data.fare == null ||
    !dispatchStatus
  ) {
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

  let data: DispatchResponse | ErrorResponse | null = null;

  try {
    data = (await response.json()) as DispatchResponse;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage = getErrorMessage(data);

    throw new Error(errorMessage || "배차 요청에 실패했습니다.");
  }

  if (!data) {
    throw new Error("배차 요청 응답을 확인할 수 없습니다.");
  }

  return unwrapDispatchResponse(data as DispatchResponse);
}
