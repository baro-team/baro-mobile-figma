export type RideLocation = {
  lat: number;
  lon: number;
  name: string;
};

export type RoutePoint = [lon: number, lat: number];

export type PreDispatchRequest = {
  user_id: number;
  origin: RideLocation;
  destination: RideLocation;
};

export type PreDispatchResponse = {
  request_id: number;
  fare: number;
  route_path: RoutePoint[];
  estimated_time: number;
  distance_km: number;
};

export type PreDispatchPreview = {
  requestId: number;
  fare: number;
  routePath: RoutePoint[];
  estimatedTime: number;
  distanceKm: number;
  origin: RideLocation;
  destination: RideLocation;
};
