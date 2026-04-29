import { useEffect, useMemo, useRef, useState } from "react";
import { Navigation } from "lucide-react";
import { loadKakaoMapSdk } from "../lib/kakao-map-sdk";
import { RideState } from "../model/ride-machine";
import { RideLocation, RoutePoint } from "../model/ride-types";

type MapStageProps = {
  origin: string;
  destination: string;
  originLocation: RideLocation | null;
  destinationLocation: RideLocation | null;
  routePath: RoutePoint[] | null;
  distanceKm: number | null;
  rideState: RideState;
};

type ProjectedPoint = {
  x: number;
  y: number;
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

function createMarkerContent(label: string, variant: "origin" | "destination") {
  const badgeColor = variant === "origin" ? "#030213" : "#22d3ee";
  const pinIcon = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 10C20 16 12 22 12 22C12 22 4 16 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="10" r="3" stroke="white" stroke-width="2"/>
    </svg>
  `;

  return `
    <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
      <div style="width:48px;height:48px;border-radius:9999px;background:${badgeColor};box-shadow:0 1px 2px rgb(15 23 42 / 0.08);display:flex;align-items:center;justify-content:center;">
        <div style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;">
          ${pinIcon}
        </div>
      </div>
      <div style="padding:4px 12px;border-radius:8px;border:1px solid #e5e7eb;background:rgb(255 255 255 / 0.92);box-shadow:0 1px 2px rgb(15 23 42 / 0.08);backdrop-filter:blur(8px);font-size:12px;line-height:16px;font-weight:500;color:#6b7280;white-space:nowrap;">
        ${label}
      </div>
    </div>
  `;
}

function FallbackMapStage({
  origin,
  destination,
  originLocation,
  destinationLocation,
  distanceKm,
  rideState,
  routePath,
}: MapStageProps) {
  const projectedRoutePoints = routePath ? getProjectedRoutePoints(routePath) : [];
  const originMarkerPosition =
    originLocation || projectedRoutePoints.length > 0
      ? projectedRoutePoints[0] ?? { x: 30, y: 40 }
      : null;
  const destinationMarkerPosition =
    destinationLocation || projectedRoutePoints.length > 0
      ? projectedRoutePoints[projectedRoutePoints.length - 1] ?? { x: 75, y: 70 }
      : null;
  const routePolylinePoints = projectedRoutePoints
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
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

      {origin && originMarkerPosition ? (
        <FallbackMarker position={originMarkerPosition} label="출발" variant="origin" />
      ) : null}

      {destination && destinationMarkerPosition ? (
        <FallbackMarker
          position={destinationMarkerPosition}
          label="도착"
          variant="destination"
        />
      ) : null}

      {origin && destination && routePolylinePoints ? (
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
      ) : null}

      {(rideState === "matched" || rideState === "riding") && (
        <div className="absolute top-[35%] left-[45%] animate-pulse">
          <div className="ds-icon-badge p-2">
            <Navigation className="w-5 h-5 text-white" />
          </div>
        </div>
      )}

      {distanceKm !== null ? (
        <div className="ds-inline-card absolute left-4 px-4 py-2 backdrop-blur-md rounded-xl bottom-[calc(1rem+var(--safe-area-bottom))]">
          <p className="type-caption ds-text-secondary">
            {distanceKm.toFixed(1)}km
          </p>
        </div>
      ) : null}
    </div>
  );
}

function FallbackMarker({
  position,
  label,
  variant,
}: {
  position: ProjectedPoint;
  label: string;
  variant: "origin" | "destination";
}) {
  return (
    <div
      className="absolute flex flex-col items-center gap-2 -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    >
      <div className={variant === "origin" ? "ds-icon-badge-neutral p-3" : "ds-icon-badge p-3"}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="h-6 w-6"
        >
          <path
            d="M20 10C20 16 12 22 12 22C12 22 4 16 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="10" r="3" stroke="white" strokeWidth="2" />
        </svg>
      </div>
      <div className="ds-inline-card px-3 py-1 rounded-lg backdrop-blur-sm">
        <p className="type-caption ds-text-secondary">{label}</p>
      </div>
    </div>
  );
}

export function MapStage(props: MapStageProps) {
  const {
    origin,
    destination,
    originLocation,
    destinationLocation,
    routePath,
    distanceKm,
    rideState,
  } = props;
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [isKakaoMapReady, setIsKakaoMapReady] = useState(false);
  const [shouldUseFallbackMap, setShouldUseFallbackMap] = useState(false);
  const hasSelectedLocations = Boolean(originLocation || destinationLocation);

  const pathSignature = useMemo(
    () => routePath?.map(([lon, lat]) => `${lon}:${lat}`).join("|") ?? "",
    [routePath],
  );

  useEffect(() => {
    let isUnmounted = false;

    loadKakaoMapSdk()
      .then(() => {
        if (!isUnmounted) {
          setIsKakaoMapReady(true);
          setShouldUseFallbackMap(false);
        }
      })
      .catch(() => {
        if (!isUnmounted) {
          setShouldUseFallbackMap(true);
        }
      });

    return () => {
      isUnmounted = true;
    };
  }, []);

  useEffect(() => {
    if (!isKakaoMapReady || !mapContainerRef.current || !window.kakao?.maps) {
      return;
    }

    const { kakao } = window;
    const routeLatLngs = routePath?.map(
      ([lon, lat]) => new kakao.maps.LatLng(lat, lon),
    ) ?? [];
    const originLatLng = originLocation
      ? new kakao.maps.LatLng(originLocation.lat, originLocation.lon)
      : null;
    const destinationLatLng = destinationLocation
      ? new kakao.maps.LatLng(destinationLocation.lat, destinationLocation.lon)
      : null;
    const markerLatLngs = [originLatLng, destinationLatLng].filter(Boolean);
    const mapCenter =
      markerLatLngs[0] ??
      routeLatLngs[0] ??
      new kakao.maps.LatLng(37.547, 127.091896);
    const map = new kakao.maps.Map(mapContainerRef.current, {
      center: mapCenter,
      level: markerLatLngs.length > 1 ? 7 : 5,
    });

    const overlays: Array<{ setMap: (map: unknown | null) => void }> = [];
    const bounds = new kakao.maps.LatLngBounds();

    routeLatLngs.forEach((latLng) => bounds.extend(latLng));

    if (routeLatLngs.length > 1) {
      const polylineStroke = new kakao.maps.Polyline({
        map,
        path: routeLatLngs,
        strokeWeight: 9,
        strokeColor: "rgba(3, 2, 19, 0.18)",
        strokeOpacity: 1,
        strokeStyle: "solid",
      });
      const polyline = new kakao.maps.Polyline({
        map,
        path: routeLatLngs,
        strokeWeight: 5,
        strokeColor: "#22d3ee",
        strokeOpacity: 0.92,
        strokeStyle: "solid",
      });
      overlays.push(polylineStroke, polyline);
    }

    if (originLatLng) {
      bounds.extend(originLatLng);
      const originOverlay = new kakao.maps.CustomOverlay({
        map,
        position: originLatLng,
        content: createMarkerContent("출발", "origin"),
        yAnchor: 1.1,
      });
      overlays.push(originOverlay);
    }

    if (destinationLatLng) {
      bounds.extend(destinationLatLng);
      const destinationOverlay = new kakao.maps.CustomOverlay({
        map,
        position: destinationLatLng,
        content: createMarkerContent("도착", "destination"),
        yAnchor: 1.1,
      });
      overlays.push(destinationOverlay);
    }

    if (markerLatLngs.length > 0 || routeLatLngs.length > 1) {
      map.setBounds(bounds, 40, 40, 40, 40);
    }

    return () => {
      overlays.forEach((overlay) => overlay.setMap(null));
    };
  }, [
    destinationLocation,
    isKakaoMapReady,
    originLocation,
    pathSignature,
    routePath,
  ]);

  if (shouldUseFallbackMap || !isKakaoMapReady) {
    return <FallbackMapStage {...props} />;
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#eef3f8]">
      <div ref={mapContainerRef} className="absolute inset-0" />

      {(rideState === "matched" || rideState === "riding") && (
        <div className="absolute top-[35%] left-[45%] z-10 animate-pulse">
          <div className="ds-icon-badge p-2">
            <Navigation className="w-5 h-5 text-white" />
          </div>
        </div>
      )}

      {distanceKm !== null ? (
        <div className="ds-inline-card absolute left-4 z-10 px-4 py-2 backdrop-blur-md rounded-xl bottom-[calc(1rem+var(--safe-area-bottom))]">
          <p className="type-caption ds-text-secondary">
            {distanceKm.toFixed(1)}km
          </p>
        </div>
      ) : null}
    </div>
  );
}
