# BARO-MobileUI Agent Guidelines

## 프로젝트 목표

모던한 기술을 사용하여 유지보수가 용이한 모바일 기준 웹을 만든다. React, Vite, TypeScript, Tailwind CSS 기반으로 Figma 시안을 빠르게 검증하면서도 실제 백엔드/카카오 API 연동을 안전하게 유지한다.

## 현재 아키텍처

- 앱 셸은 `src/app/App.tsx`에서 관리한다.
- 인증 전 화면은 `src/pages/auth`, 인증 후 승차 예약 화면은 `src/pages/ride-booking`에 둔다.
- 기능 단위 코드는 `src/features/*` 아래에 둔다.
  - `src/features/auth`: 인증 API, 세션, 로그인/회원가입 상태
  - `src/features/ride`: 승차 플로우 API, 상태 모델, hook, UI
- Vercel 서버리스 프록시는 `api/*` 아래에 둔다.
- 전역 디자인 토큰과 semantic utility는 `src/styles/theme.css`에서 관리한다.

## 승차 플로우 규칙

- 승차 상태 전이 규칙은 `src/features/ride/model/ride-machine.ts`를 기준으로 한다.
- 상태는 `booking`, `pending`, `matched`, `riding`, `completed`를 사용한다.
- 상태 변경 이벤트는 `REQUEST_RIDE`, `CAR_MATCHED`, `OPEN_DOOR`, `COMPLETE_RIDE`, `RESET_TO_BOOKING`을 사용한다.
- 새 상태나 이벤트를 추가할 때는 UI 조건, hook orchestration, 테스트/문서까지 함께 갱신한다.
- `useRideFlow`는 장소 검색, 사전 배차, 배차 요청, 차량 위치 스트림, 상태 전이를 조합하는 오케스트레이션 레이어로 유지한다.
- 개별 API 호출은 `src/features/ride/lib/*` 또는 해당 feature의 `lib/*`에 둔다.

## API와 프록시 규칙

- 프런트 컴포넌트에서 백엔드 URL을 직접 하드코딩하지 않는다.
- 브라우저 코드는 아래 프록시 경로만 호출한다.
  - 인증: `/api/auth/*`
  - 배차: `/api/dispatch/*`
  - 장소 검색: `/api/places/search`
- 로컬 개발 프록시는 `vite.config.ts`에서 관리한다.
- Vercel 배포 프록시는 `api/*` Functions에서 관리한다.
- 서버리스 함수에만 필요한 값은 `VITE_` 접두사를 붙이지 않는다.
- 브라우저 번들에 노출되어야 하는 값만 `VITE_` 접두사를 사용한다.

## TypeScript 안정성 규칙

- non-null assertion(`!`)은 사용하지 않는다.
- nullable 값은 optional chaining, nullish coalescing, 명시적 guard clause, `throw`/early return 등으로 안전하게 좁힌다.
- API 응답, DOM ref, 외부 SDK 객체처럼 런타임에서 비어 있을 수 있는 값은 사용 직전에 명시적으로 검증한다.

## 테마 관리

포인트 컬러만 바꾸면 한번에 바뀔 수 있도록 테마를 중앙 집중화한다. CSS 변수와 semantic utility를 사용하여 색상, 폰트, 간격, radius, shadow, 상태 스타일을 일관되게 관리한다.

## 디자인 시스템 규칙

색상, 폰트, 간격, radius, shadow, 상태 스타일은 가능한 한 직접 유틸리티 값을 반복해서 쓰지 않고 `theme.css`의 토큰과 semantic utility를 우선 사용한다.

### 우선 사용 원칙

- 타이포그래피는 `type-*` utility를 우선 사용한다.
- 색상/표면/보더/상태는 `ds-*` utility 또는 CSS 토큰을 우선 사용한다.
- 공통 UI는 `src/app/components/ui/*` 또는 feature 내부 공통 컴포넌트로 분리한다.
- 새로운 컴포넌트에서 동일한 스타일 패턴이 2회 이상 반복되면 semantic utility 또는 공통 컴포넌트로 승격한다.
- 단순 데코레이션이나 SVG 내부 색상처럼 토큰화 이득이 낮은 예외만 직접 값을 허용한다.
- 모바일 키보드/바텀시트/내부 스크롤이 함께 쓰이는 UI는 작은 뷰포트 기준 높이와 `overscroll` 동작을 확인한다.

## 지도와 위치 UI 규칙

- 지도 렌더링은 `src/features/ride/ui/MapStage.tsx`에서 관리한다.
- 카카오맵 SDK 로딩은 `src/features/ride/lib/kakao-map-sdk.ts`를 통해 처리한다.
- 차량 실시간 위치는 `src/features/ride/lib/vehicle-location-stream.ts`를 통해 구독한다.
- 차량 위치 마커는 지도 위 개별 핀과 화면 중앙 위치 아이콘이 중복되지 않도록 관리한다.
- 사용자가 지도 조작을 할 수 있는 기능을 추가할 때는 자동 차량 추적과 수동 탐색 모드의 충돌을 고려한다.

## 작업 전 확인

- 현재 브랜치와 `git status`를 먼저 확인한다.
- 사용자가 main 직접 push를 명시하지 않았다면 기능 작업은 새 브랜치와 PR을 기본으로 한다.
- main 직접 push 요청을 받은 경우에도 커밋 전 `git status`, `git diff`, `git log --oneline -10`을 확인한다.
- 비밀값, `.env.local`, 빌드 산출물, `node_modules`를 커밋하지 않는다.

## 검증 규칙

- TypeScript 변경 또는 문서에 명시된 코드 경로 변경 후에는 가능한 경우 `pnpm run typecheck`를 실행한다.
- UI/로직 변경 후에는 필요한 범위에서 `pnpm run lint`, `pnpm run test`, `pnpm run build`를 고려한다.
- Corepack pnpm signature 오류가 발생하면 임시로 `COREPACK_INTEGRITY_KEYS=0 pnpm run <script>`를 사용할 수 있다.

## 커밋 규칙

작업 내용은 가능한 한 논리 단위로 나누어 커밋하며, 커밋 메시지는 `{작업유형}: {작업내용}` 형식으로 작성한다. 작업 유형은 영어로, 작업 내용은 한국어로 간결하지만 해당 내용을 다 아우를 수 있게 한다.

### 작업 유형 예시

- `feat`: 새로운 기능 추가 (예: `feat: 로그인 기능 구현`)
- `fix`: 버그 수정 (예: `fix: 버튼 클릭 시 오류 해결`)
- `docs`: 문서 수정 (예: `docs: README 업데이트`)
- `style`: 코드 스타일 변경 (예: `style: 코드 포맷팅 적용`)
- `refactor`: 코드 리팩토링 (예: `refactor: 컴포넌트 구조 개선`)
- `test`: 테스트 추가/수정 (예: `test: 유닛 테스트 작성`)
- `chore`: 기타 작업 (예: `chore: 의존성 업데이트`)

### 커밋 메시지 예시

- `feat: pre배차 API 연동`
- `fix: 모바일 레이아웃 깨짐 수정`
- `refactor: 테마 시스템 중앙 집중화`
- `docs: 프로젝트 문서 최신화`

## PR 제목 규칙

PR 제목도 커밋 메시지와 동일하게 `{작업유형}: {작업내용}` 형식으로 작성한다. 작업 유형은 영어로, 작업 내용은 한국어로 작성하며 PR에서 다루는 핵심 변경을 한 줄로 드러내야 한다.

### PR 제목 예시

- `feat: 승차 요청 플로우 추가`
- `fix: 차량 도착 오버레이 닫힘 문제 수정`
- `refactor: 하단 시트 상태별 패널 구조 분리`
- `docs: 프로젝트 문서 최신화`

이 가이드라인을 따라 코드 품질과 협업 효율성을 유지한다.
