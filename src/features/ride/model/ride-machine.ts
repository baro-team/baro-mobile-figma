export type RideState =
  | "booking"
  | "pending"
  | "matched"
  | "riding"
  | "completed";

export type RideEvent =
  | "REQUEST_RIDE"
  | "CAR_MATCHED"
  | "OPEN_DOOR"
  | "COMPLETE_RIDE"
  | "RESET_TO_BOOKING";

const rideTransitions: Record<RideState, RideEvent[]> = {
  booking: ["REQUEST_RIDE"],
  pending: ["CAR_MATCHED", "RESET_TO_BOOKING"],
  matched: ["OPEN_DOOR", "RESET_TO_BOOKING"],
  riding: ["COMPLETE_RIDE", "RESET_TO_BOOKING"],
  completed: ["RESET_TO_BOOKING"],
};

const nextStateMap: Record<RideEvent, RideState> = {
  REQUEST_RIDE: "pending",
  CAR_MATCHED: "matched",
  OPEN_DOOR: "riding",
  COMPLETE_RIDE: "completed",
  RESET_TO_BOOKING: "booking",
};

export function canTransition(from: RideState, event: RideEvent) {
  return rideTransitions[from].includes(event);
}

export function transitionRideState(
  currentState: RideState,
  event: RideEvent,
): RideState {
  if (!canTransition(currentState, event)) {
    return currentState;
  }

  return nextStateMap[event];
}
