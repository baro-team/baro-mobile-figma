# Architecture Guidelines

## Page Layer

- Route-sized screens live under `src/pages`.
- A page composes app hooks, feature hooks, and feature UI into a complete screen.
- Page files should not own domain transition rules or API response mapping.

## Feature Layer

- Feature internals live under `src/features/{feature-name}`.
- Feature consumers should import from the feature `index.ts` when possible.
- `hooks` contains stateful use cases.
- `lib` contains API and platform adapters.
- `model` contains state machines and domain/API types.
- `ui` contains presentational components for the feature.

## Ride Feature Type Boundaries

- `ride-location.ts` owns location and route geometry types.
- `pre-dispatch-types.ts` owns request, response, and preview contracts for pre-dispatch.
- `ride-machine.ts` owns ride state and event transitions.
- `ride-types.ts` is a compatibility barrel for existing imports.
