import type { Action, Func } from "../base/type";

import { StateBase } from "../base/StateBase";
import { State } from "../states/State";
import { StateMachine } from "./StateMachine";
import { Transition } from "../transitions/Transition";
import { TransitionBase } from "../base/TransitionBase";

export const addState = <TOwnId, TStateId, TEvent>(
  fsm: StateMachine<TOwnId, TStateId, TEvent>,
  name: TStateId,
  options?: {
    onEnter: Action<State<TStateId, TEvent>>;
    onLogic: Action<State<TStateId, TEvent>>;
    onExit: Action<State<TStateId, TEvent>>;
    canExit: Func<State<TStateId, TEvent>, boolean>;
    needsExitTime: boolean;
    isGhostState: boolean;
  }
): void => {
  const {
    onEnter,
    onLogic,
    onExit,
    canExit,
    needsExitTime = false,
    isGhostState = false,
  } = options || {};

  // Optimise for empty states
  if (!onEnter && !onLogic && !onExit && !canExit) {
    fsm.addState(name, new StateBase<TStateId>(needsExitTime, isGhostState));
    return;
  }

  fsm.addState(name, new State<TStateId, TEvent>(options));
};

export const addTransition = <TOwnId, TStateId, TEvent>(
  fsm: StateMachine<TOwnId, TStateId, TEvent>,
  from: TStateId,
  to: TStateId,
  options?: {
    condition: Func<Transition<TStateId>, boolean>;
    onTransition: Action<Transition<TStateId>>;
    afterTransition: Action<Transition<TStateId>>;
    forceInstantly: boolean;
  }
): void => {
  fsm.addTransition(createOptimizedTransition(from, to, options));
};

export const addTransitionFromAny = <TOwnId, TStateId, TEvent>(
  fsm: StateMachine<TOwnId, TStateId, TEvent>,
  to: TStateId,
  options?: {
    condition: Func<Transition<TStateId>, boolean>;
    onTransition: Action<Transition<TStateId>>;
    afterTransition: Action<Transition<TStateId>>;
    forceInstantly: boolean;
  }
): void => {
  fsm.addTransitionFromAny(
    createOptimizedTransition<TStateId>(undefined, to, options)
  );
};

export const addTriggerTransition = <TOwnId, TStateId, TEvent>(
  fsm: StateMachine<TOwnId, TStateId, TEvent>,
  trigger: TEvent,
  from: TStateId,
  to: TStateId,
  options?: {
    condition: Func<Transition<TStateId>, boolean>;
    onTransition: Action<Transition<TStateId>>;
    afterTransition: Action<Transition<TStateId>>;
    forceInstantly: boolean;
  }
): void => {
  fsm.addTriggerTransition(
    trigger,
    createOptimizedTransition(from, to, options)
  );
};

export const addTriggerTransitionFromAny = <TOwnId, TStateId, TEvent>(
  fsm: StateMachine<TOwnId, TStateId, TEvent>,
  trigger: TEvent,
  to: TStateId,
  options?: {
    condition: Func<Transition<TStateId>, boolean>;
    onTransition: Action<Transition<TStateId>>;
    afterTransition: Action<Transition<TStateId>>;
    forceInstantly: boolean;
  }
): void => {
  fsm.addTriggerTransitionFromAny(
    trigger,
    createOptimizedTransition(undefined, to, options)
  );
};

export const addTwoWayTransition = <TOwnId, TStateId, TEvent>(
  fsm: StateMachine<TOwnId, TStateId, TEvent>,
  from: TStateId,
  to: TStateId,
  options?: {
    condition: Func<Transition<TStateId>, boolean>;
    onTransition: Action<Transition<TStateId>>;
    afterTransition: Action<Transition<TStateId>>;
    forceInstantly: boolean;
  }
): void => {
  fsm.addTwoWayTransition(new Transition<TStateId>(from, to, options));
};

export const addTwoWayTriggerTransition = <TOwnId, TStateId, TEvent>(
  fsm: StateMachine<TOwnId, TStateId, TEvent>,
  trigger: TEvent,
  from: TStateId,
  to: TStateId,
  options?: {
    condition: Func<Transition<TStateId>, boolean>;
    onTransition: Action<Transition<TStateId>>;
    afterTransition: Action<Transition<TStateId>>;
    forceInstantly: boolean;
  }
): void => {
  fsm.addTwoWayTriggerTransition(
    trigger,
    new Transition<TStateId>(from, to, options)
  );
};

export const addExitTransition = <TOwnId, TStateId, TEvent>(
  fsm: StateMachine<TOwnId, TStateId, TEvent>,
  from: TStateId,
  options?: {
    condition: Func<Transition<TStateId>, boolean>;
    onTransition: Action<Transition<TStateId>>;
    afterTransition: Action<Transition<TStateId>>;
    forceInstantly: boolean;
  }
): void => {
  fsm.addExitTransition(createOptimizedTransition(from, undefined, options));
};

export const addExitTransitionFromAny = <TOwnId, TStateId, TEvent>(
  fsm: StateMachine<TOwnId, TStateId, TEvent>,

  options?: {
    condition: Func<Transition<TStateId>, boolean>;
    onTransition: Action<Transition<TStateId>>;
    afterTransition: Action<Transition<TStateId>>;
    forceInstantly: boolean;
  }
): void => {
  fsm.addExitTransitionFromAny(
    createOptimizedTransition(undefined, undefined, options)
  );
};

export const addExitTriggerTransition = <TOwnId, TStateId, TEvent>(
  fsm: StateMachine<TOwnId, TStateId, TEvent>,
  trigger: TEvent,
  from: TStateId,
  options?: {
    condition: Func<Transition<TStateId>, boolean>;
    onTransition: Action<Transition<TStateId>>;
    afterTransition: Action<Transition<TStateId>>;
    forceInstantly: boolean;
  }
): void => {
  fsm.addExitTriggerTransition(
    trigger,
    createOptimizedTransition(from, undefined, options)
  );
};

export const addExitTriggerTransitionFromAny = <TOwnId, TStateId, TEvent>(
  fsm: StateMachine<TOwnId, TStateId, TEvent>,
  trigger: TEvent,
  options?: {
    condition: Func<Transition<TStateId>, boolean>;
    onTransition: Action<Transition<TStateId>>;
    afterTransition: Action<Transition<TStateId>>;
    forceInstantly: boolean;
  }
): void => {
  fsm.addExitTriggerTransitionFromAny(
    trigger,
    createOptimizedTransition(undefined, undefined, options)
  );
};

const createOptimizedTransition = <TStateId>(
  from: TStateId,
  to: TStateId,
  options?: {
    condition: Func<Transition<TStateId>, boolean>;
    onTransition: Action<Transition<TStateId>>;
    afterTransition: Action<Transition<TStateId>>;
    forceInstantly: boolean;
  }
): TransitionBase<TStateId> => {
  const {
    condition,
    onTransition,
    afterTransition,
    forceInstantly = false,
  } = options || {};

  if (!condition && !onTransition && !afterTransition)
    return new TransitionBase<TStateId>(from, to, forceInstantly);

  return new Transition<TStateId>(from, to, options);
};
