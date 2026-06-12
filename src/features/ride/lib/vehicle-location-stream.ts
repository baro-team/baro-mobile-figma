import { VehicleLocation } from "../model/ride-location";

type VehicleLocationStreamHandlers = {
  onMessage: (location: VehicleLocation) => void;
  onError?: (error: Error) => void;
};

function parseVehicleLocation(payload: unknown): VehicleLocation | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as Record<string, unknown>;
  const lat = Number(data.lat ?? data.latitude);
  const lon = Number(data.lon ?? data.lng ?? data.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return {
    lat,
    lon,
    heading: Number.isFinite(Number(data.heading)) ? Number(data.heading) : undefined,
    speed: Number.isFinite(Number(data.speed)) ? Number(data.speed) : undefined,
    phase: typeof data.phase === "string" ? data.phase : undefined,
    status: typeof data.status === "string" ? data.status : undefined,
    updatedAt:
      typeof data.updatedAt === "string"
        ? data.updatedAt
        : typeof data.timestamp === "string"
          ? data.timestamp
          : undefined,
  };
}

export function openVehicleLocationStream(
  dispatchId: number,
  accessToken: string,
  handlers: VehicleLocationStreamHandlers,
) {
  const abortController = new AbortController();
  let reconnectTimer: number | null = null;
  let reconnectAttempt = 0;

  const handlePayload = (payload: string) => {
    try {
      const parsed = parseVehicleLocation(JSON.parse(payload));
      if (parsed) handlers.onMessage(parsed);
    } catch {
      handlers.onError?.(new Error("차량 위치 스트림을 처리하지 못했습니다."));
    }
  };

  const scheduleReconnect = () => {
    if (abortController.signal.aborted) return;
    const delayMs = Math.min(10_000, 1_000 * 2 ** reconnectAttempt);
    reconnectAttempt += 1;
    reconnectTimer = window.setTimeout(connect, delayMs);
  };

  const connect = async () => {
    try {
      const response = await fetch(`/api/dispatch/${dispatchId}/vehicle-location/stream`, {
        headers: {
          Accept: "text/event-stream",
          Authorization: `Bearer ${accessToken}`,
        },
        signal: abortController.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error("차량 위치 스트림 연결에 실패했습니다.");
      }

      const reader = response.body.getReader();
      const abortListener = () => {
        void reader.cancel();
      };
      abortController.signal.addEventListener("abort", abortListener);

      try {
        const decoder = new TextDecoder();
        let buffer = "";
        reconnectAttempt = 0;

        while (!abortController.signal.aborted) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split(/\r?\n\r?\n/);
          buffer = events.pop() ?? "";

          for (const event of events) {
            const data = event
              .split(/\r?\n/)
              .filter((line) => line.startsWith("data:"))
              .map((line) => line.slice(5).trimStart())
              .join("\n");

            if (data) handlePayload(data);
          }
        }
      } finally {
        abortController.signal.removeEventListener("abort", abortListener);
      }

      scheduleReconnect();
    } catch (error) {
      if (!abortController.signal.aborted) {
        handlers.onError?.(
          error instanceof Error ? error : new Error("차량 위치 스트림 연결에 실패했습니다."),
        );
        scheduleReconnect();
      }
    }
  };

  void connect();

  return () => {
    abortController.abort();
    if (reconnectTimer !== null) {
      window.clearTimeout(reconnectTimer);
    }
  };
}
