# BARO Mobile UI

BARO 승차 플로우를 모바일 화면 기준으로 구현한 프런트엔드 프로토타입입니다. Figma 시안을 바탕으로 인증, 장소 검색, 사전 배차, 배차 요청, 실시간 차량 위치, 차량 도착, 탑승 진행, 운행 완료까지의 흐름을 한 화면 안에서 확인할 수 있도록 구성했습니다.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.12-06B6D4?logo=tailwindcss&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-12.23.24-0F172A?logo=framer&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide-Icons-F56565?logo=lucide&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Preview-000000?logo=vercel&logoColor=white)

원본 디자인: [BARO-MobileUI Figma](https://www.figma.com/design/Q49GNx8cbuwPZkYKa5LVvJ/BARO-MobileUI)

## 프로젝트 개요

이 프로젝트는 다음 목적을 가집니다.

- 모바일 승차 경험을 빠르게 검증할 수 있는 UI 프로토타입 제공
- 상태 전이를 명시적으로 관리하는 ride flow 구조 실험
- Figma 기반 화면을 Vite + React + TypeScript 조합으로 재구성
- 백엔드 API와 카카오 Local/Map API를 프런트 개발 환경에서 안전하게 프록시

현재 승차 플로우는 아래 순서로 동작합니다.

1. 로그인 또는 회원가입 후 승차 예약 화면에 진입합니다.
2. 출발지와 목적지를 카카오 장소 검색으로 선택합니다.
3. 사전 배차 API로 예상 시간, 거리, 요금, 경로를 확인합니다.
4. 배차 요청 후 반경을 넓혀가며 차량 탐색 상태를 보여줍니다.
5. 차량이 매칭되면 차량번호, 배차 상태, 예상 도착 정보를 표시합니다.
6. 차량 위치 스트림으로 지도 중심을 차량 실시간 위치에 맞추고, 중앙 위치 아이콘을 차량 마커로 사용합니다.
7. 차량 도착 오버레이에서 잠금 해제를 누르면 운행 상태로 전환됩니다.
8. 일정 시간이 지나면 운행 완료 상태로 전환됩니다.

## 기술 스택

- React 18
- TypeScript 5
- Vite 6
- Tailwind CSS 4
- Motion
- Lucide React
- Vitest

## 실행 방법

이 저장소는 `pnpm` 기준으로 구성되어 있습니다.

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 로컬 환경 변수 설정

`.env.local.example`을 참고해 `.env.local`을 생성합니다.

```bash
VITE_KAKAO_MAP_APP_KEY=your_kakao_javascript_key
KAKAO_REST_API_KEY=your_kakao_rest_api_key
VITE_BACKEND_API_BASE_URL=https://dev.barocloud.com
```

- `VITE_KAKAO_MAP_APP_KEY`: 브라우저에서 카카오맵 JavaScript SDK로 지도 렌더링을 할 때 사용합니다.
- `KAKAO_REST_API_KEY`: 로컬 Vite dev proxy가 `/api/places/search` 요청을 카카오 Local REST API로 전달할 때 사용합니다.
- `VITE_BACKEND_API_BASE_URL`: 로컬 Vite dev proxy가 `/api/auth/*`, `/api/dispatch/*` 요청을 백엔드로 전달할 때 사용하는 베이스 URL입니다.

### 3. 개발 서버 실행

```bash
pnpm run dev
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

### 4. 검증 및 빌드

```bash
pnpm run typecheck
pnpm run lint
pnpm run test
pnpm run build
```

Corepack pnpm signature 오류가 발생하는 환경에서는 임시로 아래처럼 실행할 수 있습니다.

```bash
COREPACK_INTEGRITY_KEYS=0 pnpm run typecheck
```

## 환경 변수와 프록시

현재 백엔드 Base URL은 `https://dev.barocloud.com`을 기본값으로 사용합니다.

### 로컬 Vite proxy

로컬 개발에서는 프런트가 직접 외부 API를 호출하지 않고 `/api/*` 경로를 호출합니다.

- `/api/auth/*` → `${VITE_BACKEND_API_BASE_URL}/user/auth/*`
- `/api/dispatch` → `${VITE_BACKEND_API_BASE_URL}/dispatch`
- `/api/dispatch/pre` → `${VITE_BACKEND_API_BASE_URL}/dispatch/pre`
- `/api/dispatch/*` → `${VITE_BACKEND_API_BASE_URL}/dispatch/*`
- `/api/places/search` → `https://dapi.kakao.com/v2/local/search/keyword.json`

### Vercel 환경 변수

Vercel Preview/Production에는 아래 값을 설정합니다.

```bash
BACKEND_BASE_URL=https://dev.barocloud.com
KAKAO_REST_API_KEY=카카오_REST_API_키
VITE_KAKAO_MAP_APP_KEY=카카오_JavaScript_키
```

- `BACKEND_BASE_URL`: Vercel 서버리스 함수가 백엔드로 요청을 전달할 때 사용하는 공통 베이스 URL입니다.
- `KAKAO_REST_API_KEY`: `api/places/search.ts`가 카카오 Local REST API를 호출할 때 사용합니다.
- `VITE_KAKAO_MAP_APP_KEY`: 브라우저 번들에 주입되는 카카오맵 JavaScript 키입니다.

## 주요 백엔드 엔드포인트

- User Swagger: `https://dev.barocloud.com/user/swagger-ui.html`
- Dispatch Swagger: `https://dev.barocloud.com/dispatch/swagger-ui.html`
- 회원가입: `POST /api/auth/sign-up`
- 로그인: `POST /api/auth/login`
- 장소 검색: `GET /api/places/search?query={keyword}&size={size}`
- 사전 배차: `POST /api/dispatch/pre`
- 배차: `POST /api/dispatch`
- 차량 위치 스트림: `GET /api/dispatch/{dispatchId}/vehicle-location/stream`

## 디렉터리 구조

```text
api/
  auth/                  # Vercel 인증 프록시
  dispatch/              # Vercel 배차/차량 위치 프록시
  places/                # Vercel 카카오 장소 검색 프록시
src/
  app/                   # 앱 셸과 공통 UI
  assets/                # Figma asset resolver 대상
  features/
    auth/                # 로그인/회원가입 상태와 API
    ride/                # 승차 플로우, API, 모델, UI
  pages/
    auth/                # 인증 페이지
    ride-booking/        # 승차 예약 페이지
  styles/                # 디자인 토큰과 semantic utilities
nginx/                   # 컨테이너 배포용 nginx 템플릿
docs/                    # 보조 문서
guidelines/              # 개발 가이드
```

## 주요 파일 역할

- `src/app/App.tsx`: 인증 상태에 따라 인증 페이지와 승차 예약 페이지를 전환합니다.
- `src/features/auth/hooks/useAuthFlow.ts`: 로그인/회원가입 입력, 세션, 제출 상태를 관리합니다.
- `src/pages/ride-booking/RideBookingPage.tsx`: 승차 예약 화면 전체를 조합합니다.
- `src/features/ride/hooks/useRideFlow.ts`: 장소 검색, 사전 배차, 배차, 차량 위치 스트림, 상태 전이를 오케스트레이션합니다.
- `src/features/ride/model/ride-machine.ts`: `booking -> pending -> matched -> riding -> completed` 상태 전이를 정의합니다.
- `src/features/ride/ui/BookingPanel.tsx`: 출발지/목적지 입력, 장소 검색 결과, 사전 배차 요약을 렌더링합니다.
- `src/features/ride/ui/MapStage.tsx`: 카카오맵, 경로, 출발/도착 마커, 차량 위치 중심 추적을 담당합니다.
- `src/features/ride/ui/RideBottomSheet.tsx`: 상태별 하단 시트 UI를 렌더링합니다.
- `src/features/ride/ui/CarArrivedOverlay.tsx`: 차량 도착 시점의 잠금 해제 오버레이를 표시합니다.
- `src/features/ride/ui/RideCompletedOverlay.tsx`: 운행 완료 오버레이를 표시합니다.

## 상태 관리 구조

승차 상태 전이는 `ride-machine.ts`에 분리되어 있으며, 허용된 이벤트만 다음 상태로 이동할 수 있습니다.

- `REQUEST_RIDE`
- `CAR_MATCHED`
- `OPEN_DOOR`
- `COMPLETE_RIDE`
- `RESET_TO_BOOKING`

이 구조 덕분에 화면 로직과 상태 전이 규칙을 분리할 수 있고, 잘못된 전이로 인한 UI 꼬임을 줄일 수 있습니다.

## 최근 반영 사항

- 인증 게이트와 승차 예약 페이지 분리
- 카카오 장소 검색 연동 및 검색 결과 스크롤 UI 개선
- 사전 배차 미리보기와 실제 배차 요청 연동
- 차량 위치 SSE 스트림 처리 및 지도 중심 추적
- 차량 위치를 별도 지도 핀 대신 화면 중앙 위치 아이콘으로 표현
- 차량번호 중복 표시 제거
- Vercel/Vite 프록시로 인증, 배차, 장소 검색, 차량 위치 스트림 경로 정리

## 배포

PR 생성 또는 갱신 시 Vercel Preview 배포가 생성됩니다. 서버리스 프록시는 `api/` 디렉터리의 Vercel Functions를 사용합니다.

필요한 Vercel 환경 변수:

- `BACKEND_BASE_URL`
- `KAKAO_REST_API_KEY`
- `VITE_KAKAO_MAP_APP_KEY`

## 참고 사항

- 로컬 개발 환경에서는 `pnpm` 설치가 필요합니다.
- 카카오맵을 실제로 띄우려면 카카오 개발자 콘솔에 로컬/배포 도메인을 등록해야 합니다.
- 빌드 산출물 `dist/`와 의존성 디렉터리 `node_modules/`는 Git에 포함하지 않습니다.
- 프런트 컴포넌트에서는 백엔드 URL을 직접 하드코딩하지 말고 `/api/*` 경로와 프록시를 사용합니다.
