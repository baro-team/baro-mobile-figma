import { MapPin, Navigation } from "lucide-react";
import { RideState } from "../model/ride-machine";
import { RoutePoint } from "../model/ride-types";

type MapStageProps = {
  origin: string;
  destination: string;
  routePath: RoutePoint[] | null;
  distanceKm: number | null;
  rideState: RideState;
};

const MAP_PADDING = 0.16;

function getProjectedRoutePoints(routePath: RoutePoint[]) {
  if (routePath.length === 0) {
    return [];
  }

  const longitudes = routePath.map(([lon]) => lon);
  const latitudes = routePath.map(([, lat]) => lat);
  const minLon = Math.min(...longitudes);
  const maxLon = Math.max(...longitudes);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const lonRange = maxLon - minLon || 0.001;
  const latRange = maxLat - minLat || 0.001;

  return routePath.map(([lon, lat]) => {
    const normalizedX = (lon - minLon) / lonRange;
    const normalizedY = (maxLat - lat) / latRange;
    const x = (MAP_PADDING + normalizedX * (1 - MAP_PADDING * 2)) * 100;
    const y = (MAP_PADDING + normalizedY * (1 - MAP_PADDING * 2)) * 100;

    return { x, y };
  });
}

export function MapStage({
  origin,
  destination,
  routePath,
  distanceKm,
  rideState,
}: MapStageProps) {
  const projectedRoutePoints = routePath ? getProjectedRoutePoints(routePath) : [];
  const originMarkerPosition = projectedRoutePoints[0] ?? { x: 30, y: 40 };
  const destinationMarkerPosition =
    projectedRoutePoints[projectedRoutePoints.length - 1] ?? { x: 75, y: 70 };
  const routePolylinePoints = projectedRoutePoints
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  return (
    <div className="relative w-full flex-1 min-h-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-[20%] left-[30%] w-32 h-32 bg-cyan-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[30%] right-[20%] w-40 h-40 bg-cyan-400 rounded-full blur-3xl"></div>
        <div className="absolute top-[60%] left-[50%] w-36 h-36 bg-cyan-300 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-5">
        {Array.from({ length: 144 }).map((_, i) => (
          <div key={i} className="border border-gray-300"></div>
        ))}
      </div>

      {origin && (
        <div
          className="absolute flex flex-col items-center gap-2 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${originMarkerPosition.x}%`,
            top: `${originMarkerPosition.y}%`,
          }}
        >
          <div className="ds-icon-badge-neutral p-3">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div className="ds-inline-card px-3 py-1 rounded-lg backdrop-blur-sm">
            <p className="type-caption ds-text-secondary">출발</p>
          </div>
        </div>
      )}

      {destination && (
        <div
          className="absolute flex flex-col items-center gap-2 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${destinationMarkerPosition.x}%`,
            top: `${destinationMarkerPosition.y}%`,
          }}
        >
          <div className="ds-icon-badge p-3">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div className="ds-inline-card px-3 py-1 rounded-lg backdrop-blur-sm">
            <p className="type-caption ds-text-secondary">도착</p>
          </div>
        </div>
      )}

      {origin && destination && routePolylinePoints && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <polyline
            points={routePolylinePoints}
            stroke="url(#routeGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
            className={rideState === "booking" ? "" : "animate-pulse"}
          />
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {(rideState === "matched" || rideState === "riding") && (
        <div className="absolute top-[35%] left-[45%] animate-pulse">
          <div className="ds-icon-badge p-2">
            <Navigation className="w-5 h-5 text-white" />
          </div>
        </div>
      )}

      {distanceKm !== null && (
        <div className="ds-inline-card absolute left-4 px-4 py-2 backdrop-blur-md rounded-xl bottom-[calc(1rem+var(--safe-area-bottom))]">
          <p className="type-caption ds-text-secondary">
            {distanceKm.toFixed(1)}km
          </p>
        </div>
      )}
    </div>
  );
}
