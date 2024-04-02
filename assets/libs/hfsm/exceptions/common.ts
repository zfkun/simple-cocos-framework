import { format } from "./ExceptionFormatter";
import { StateMachineException } from "./StateMachineException";

export const NotInitialized = (
  context?: string,
  problem?: string,
  solution?: string
): StateMachineException => {
  return new StateMachineException(
    format(
      context,
      problem ??
        "The active state is null because the state machine has not been set up yet.",
      solution ??
        "Call fsm.setStartState(...) and fsm.init() or fsm.onEnter() " +
          "to initialize the state machine."
    )
  );
};

export const StateNotFound = (
  stateName: string,
  context?: string,
  problem?: string,
  solution?: string
): StateMachineException => {
  return new StateMachineException(
    format(
      context,
      problem ??
        `The state "${stateName}" has not been defined yet / doesn't exist.`,
      solution ??
        "\n" +
          "1. Check that there are no typos in the state names and transition from and to names\n" +
          "2. Add this state before calling init / onEnter / onLogic / requestStateChange / ..."
    )
  );
};

export const MissingStartState = (
  context?: string,
  problem?: string,
  solution?: string
): StateMachineException => {
  return new StateMachineException(
    format(
      context,
      problem ??
        "No start state is selected. " +
          "The state machine needs at least one state to function properly.",
      solution ??
        "Make sure that there is at least one state in the state machine " +
          "before running init() or onEnter() by calling fsm.addState(...)."
    )
  );
};

export const QuickIndexerMisusedForGettingState = (
  stateName: string
): StateMachineException => {
  return new StateMachineException(
    format(
      "Getting a nested state machine with the indexer",
      "The selected state is not a state machine.",
      "This method is only there for quickly accessing a nested state machine. " +
        `To get the selected state, use getState("${stateName}")`
    )
  );
};
