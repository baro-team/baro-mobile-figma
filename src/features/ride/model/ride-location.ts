export type RideLocation = {
  lat: number;
  lon: number;
  name: string;
};

export type PlaceSearchResult = RideLocation & {
  addressName: string;
  roadAddressName: string;
};

export type RoutePoint = [lon: number, lat: number];

export type VehicleLocation = {
  lat: number;
  lon: number;
  carNumber?: string;
  heading?: number;
  speed?: number;
  phase?: string;
  status?: string;
  updatedAt?: string;
};
