# BARO Mobile UI

BARO 승차 플로우를 모바일 화면 기준으로 구현한 프런트엔드 프로토타입입니다.  
Figma 시안을 바탕으로 배차 요청부터 차량 도착, 탑승 진행, 운행 완료까지의 흐름을 한 화면 안에서 확인할 수 있도록 구성했습니다.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.12-06B6D4?logo=tailwindcss&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-12.23.24-0F172A?logo=framer&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide-Icons-F56565?logo=lucide&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Preview-000000?logo=vercel&logoColor=white)

원본 디자인:
[BARO-MobileUI Figma](https://www.figma.com/design/Q49GNx8cbuwPZkYKa5LVvJ/BARO-MobileUI)

## 프로젝트 개요

이 프로젝트는 다음 목적을 가집니다.

- 모바일 승차 경험을 빠르게 검증할 수 있는 UI 프로토타입 제공
- 상태 전이를 명시적으로 관리하는 ride flow 구조 실험
- Figma 기반 화면을 Vite + React 조합으로 재구성

현재 승차 플로우는 아래 순서로 동작합니다.

1. 출발지와 목적지를 입력합니다.
2. 배차 요청 후 반경을 넓혀가며 차량 탐색 상태를 보여줍니다.
3. 차량이 매칭되면 예상 도착 시간과 예상 요금을 표시합니다.
4. 차량 도착 오버레이에서 잠금 해제를 누르면 운행 상태로 전환됩니다.
5. 일정 시간이 지나면 운행 완료 상태로 전환됩니다.

## 기술 스택

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Motion

## 실행 방법

이 저장소는 `pnpm` 기준으로 구성되어 있습니다.

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 개발 서버 실행

```bash
pnpm run dev
```

카카오맵 기반 경로 미리보기를 사용하려면 `.env.local`에 아래 값을 추가합니다.

```bash
VITE_KAKAO_MAP_APP_KEY=your_kakao_javascript_key
```

### 3. 프로덕션 빌드

```bash
pnpm run build
```

## 디렉터리 구조

```text
src/
  app/
    App.tsx
    components/
  features/
    ride/
      hooks/
      model/
      ui/
  styles/
```

주요 파일 역할은 아래와 같습니다.

- `src/app/App.tsx`
  화면 조합과 오케스트레이션을 담당합니다.
- `src/features/ride/hooks/useRideFlow.ts`
  승차 흐름의 상태, 타이머, 액션을 관리합니다.
- `src/features/ride/model/ride-machine.ts`
  `booking -> pending -> matched -> riding -> completed` 상태 전이를 정의합니다.
- `src/features/ride/ui/MapStage.tsx`
  상단 지도 영역 표현을 담당합니다.
- `src/features/ride/ui/RideBottomSheet.tsx`
  상태별 하단 시트 UI를 렌더링합니다.
- `src/features/ride/ui/CarArrivedOverlay.tsx`
  차량 도착 시점의 잠금 해제 오버레이를 표시합니다.
- `src/features/ride/ui/RideCompletedOverlay.tsx`
  운행 완료 오버레이를 표시합니다.

## 상태 관리 구조

승차 상태 전이는 `ride-machine.ts`에 분리되어 있으며, 허용된 이벤트만 다음 상태로 이동할 수 있습니다.

- `REQUEST_RIDE`
- `CAR_MATCHED`
- `OPEN_DOOR`
- `COMPLETE_RIDE`
- `RESET_TO_BOOKING`

이 구조 덕분에 화면 로직과 상태 전이 규칙을 분리할 수 있고, 잘못된 전이로 인한 UI 꼬임을 줄일 수 있습니다.

## 최근 반영 사항

- 단일 대형 컴포넌트를 hook + feature UI 조합 구조로 분리
- 차량 도착 오버레이를 backdrop 클릭으로 닫을 수 없도록 수정해 UX dead-end 제거
- ETA 표기를 두 자리 분 포맷으로 정리
- 예상 요금이 없을 때 빈 통화 기호만 노출되지 않도록 fallback 처리
- `.gitignore`를 추가해 `node_modules`, `dist`, 로컬 환경 파일 등이 커밋되지 않도록 정리

## 배포

PR 생성 또는 갱신 시 GitHub Actions를 통해 Vercel Preview 배포를 수행하도록 설정되어 있습니다.

워크플로 파일:
[`/.github/workflows/preview.yml`](/Users/yujin/IdeaProjects/baro-mobile-figma/.github/workflows/preview.yml)

필요한 GitHub Secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 참고 사항

- 로컬 개발 환경에서는 `pnpm` 설치가 필요합니다.
- 카카오맵을 실제로 띄우려면 카카오 개발자 콘솔에 로컬/배포 도메인을 등록해야 합니다.
- 빌드 산출물 `dist/`와 의존성 디렉터리 `node_modules/`는 Git에 포함하지 않습니다.
- `pre배차` 예상 정보는 현재 `http://localhost:8082/dispatch/pre`를 직접 호출하며, 서버가 내려가 있으면 booking 단계에서 에러 메시지로 fallback 됩니다.
