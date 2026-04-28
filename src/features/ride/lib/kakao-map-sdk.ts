const KAKAO_MAP_APP_KEY = import.meta.env.VITE_KAKAO_MAP_APP_KEY;
const KAKAO_MAP_SDK_ID = "kakao-map-sdk";

declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: unknown) => unknown;
        LatLng: new (lat: number, lon: number) => unknown;
        LatLngBounds: new () => {
          extend: (latLng: unknown) => void;
        };
        Polyline: new (options: unknown) => {
          setMap: (map: unknown | null) => void;
        };
        CustomOverlay: new (options: unknown) => {
          setMap: (map: unknown | null) => void;
          setPosition?: (latLng: unknown) => void;
        };
      };
    };
  }
}

let sdkPromise: Promise<typeof window.kakao> | null = null;

export function getKakaoMapAppKey() {
  return KAKAO_MAP_APP_KEY ?? "";
}

export function loadKakaoMapSdk() {
  if (!KAKAO_MAP_APP_KEY) {
    return Promise.reject(new Error("VITE_KAKAO_MAP_APP_KEY가 설정되지 않았습니다."));
  }

  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao);
  }

  if (sdkPromise) {
    return sdkPromise;
  }

  sdkPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(
      KAKAO_MAP_SDK_ID,
    ) as HTMLScriptElement | null;

    const handleLoad = () => {
      if (!window.kakao?.maps) {
        reject(new Error("카카오맵 SDK를 불러오지 못했습니다."));
        return;
      }

      window.kakao.maps.load(() => {
        if (!window.kakao) {
          reject(new Error("카카오맵 SDK 초기화에 실패했습니다."));
          return;
        }

        resolve(window.kakao);
      });
    };

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("카카오맵 SDK 스크립트 로딩에 실패했습니다.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = KAKAO_MAP_SDK_ID;
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&autoload=false`;
    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("카카오맵 SDK 스크립트 로딩에 실패했습니다.")),
      { once: true },
    );
    document.head.appendChild(script);
  });

  return sdkPromise;
}
