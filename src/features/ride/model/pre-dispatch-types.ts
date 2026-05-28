import { RideLocation, RoutePoint } from "./ride-location";

export type PreDispatchRequest = {
  user_id: number;
  origin: RideLocation;
  destination: RideLocation;
};

export type PreDispatchResponseData = {
  requestId?: number;
  request_id?: number;
  fare: number;
  routePath?: RoutePoint[];
  route_path?: RoutePoint[];
  estimatedTime?: number;
  estimated_time?: number;
  distanceKm?: number;
  distance_km?: number;
};

export type DispatchRequest = {
  request_id: number;
  user_id: number;
};

export type DispatchResponseData = {
  dispatchId?: number;
  dispatch_id?: number;
  requestId?: number;
  request_id?: number;
  userId?: number;
  user_id?: number;
  carId?: number;
  car_id?: number;
  standId?: number;
  stand_id?: number;
  estimatedPickupTime?: number;
  estimated_pickup_time?: number;
  estimatedRideTime?: number;
  estimated_ride_time?: number;
  pickupRoutePath?: RoutePoint[];
  pickup_route_path?: RoutePoint[];
  dropoffRoutePath?: RoutePoint[];
  dropoff_route_path?: RoutePoint[];
  fare: number;
  dispatchStatus?: string;
  dispatch_status?: string;
};

export type BaseApiResponse<TData> = {
  success: boolean;
  data?: TData;
  error?: {
    code: string;
    message: string;
  };
  message?: string;
};

export type PreDispatchResponse =
  | PreDispatchResponseData
  | BaseApiResponse<PreDispatchResponseData>;

export type DispatchResponse =
  | DispatchResponseData
  | BaseApiResponse<DispatchResponseData>;

export type PreDispatchPreview = {
  requestId: number;
  fare: number;
  routePath: RoutePoint[];
  estimatedTime: number;
  distanceKm: number;
  origin: RideLocation;
  destination: RideLocation;
};

export type DispatchResult = {
  dispatchId: number;
  requestId: number;
  userId: number;
  carId: number;
  standId: number;
  estimatedPickupTime?: number;
  estimatedRideTime: number;
  pickupRoutePath: RoutePoint[];
  dropoffRoutePath: RoutePoint[];
  fare: number;
  dispatchStatus: string;
};
