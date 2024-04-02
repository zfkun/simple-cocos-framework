import type {
  IActionable,
  IStateMachine,
  ITransitionListener,
  ITriggerable,
} from "../base/interface";
import { StateBase } from "../base/StateBase";
import { TransitionBase } from "../base/TransitionBase";
import { ReverseTransition } from "../transitions/ReverseTransition";

import * as errors from "../exceptions/common";

interface PendingTransition<TStateId> {
  targetState?: TStateId;
  isExitTransition: boolean;
  listener?: ITransitionListener;
  isPending: boolean;
}

function createPendingTransitionForExit<TStateId>(
  listener?: ITransitionListener
): PendingTransition<TStateId> {
  return {
    targetState: undefined,
    isExitTransition: true,
    listener: listener,
    isPending: true,
  };
}

function createPendingTransitionForState<TStateId>(
  target: TStateId,
  listener?: ITransitionListener
): PendingTransition<TStateId> {
  return {
    targetState: target,
    isExitTransition: false,
    listener: listener,
    isPending: true,
  };
}

class StateBundle<TStateId, TEvent> {
  // By default, these fields are all null and only get a value when you need them.
  // => Lazy evaluation => Memory efficient, when you only need a subset of features
  public state: StateBase<TStateId>;
  public transitions: Array<TransitionBase<TStateId>>;
  public triggerToTransitions: Map<TEvent, Array<TransitionBase<TStateId>>>;

  public addTransition(t: TransitionBase<TStateId>): void {
    this.transitions = this.transitions || [];
    this.transitions.push(t);
  }

  public addTriggerTransition(
    trigger: TEvent,
    transition: TransitionBase<TStateId>
  ): void {
    this.triggerToTransitions =
      this.triggerToTransitions ||
      new Map<TEvent, Array<TransitionBase<TStateId>>>();

    let transitionsOfTrigger = this.triggerToTransitions.get(trigger);
    if (!transitionsOfTrigger) {
      transitionsOfTrigger = [];
      this.triggerToTransitions.set(trigger, transitionsOfTrigger);
    }

    transitionsOfTrigger.push(transition);
  }
}

export class StateMachine<TOwnId, TStateId, TEvent>
  extends StateBase<TOwnId>
  implements ITriggerable<TEvent>, IStateMachine, IActionable<TEvent>
{
  //   private static readonly noTransitions: Array<TransitionBase<TStateId>> = [];
  //   private static readonly noTriggerTransitions: Map<
  //     TEvent,
  //     Array<TransitionBase<TStateId>>
  //   > = new Map<TEvent, Array<TransitionBase<TStateId>>>();

  private _startState: { state: TStateId; hasState: boolean } = {
    state: undefined,
    hasState: false,
  };
  private _pendingTransition: PendingTransition<TStateId>;

  // Central storage of states.
  private _stateBundlesByName: Map<TStateId, StateBundle<TStateId, TEvent>> =
    new Map<TStateId, StateBundle<TStateId, TEvent>>();

  private _activeState: StateBase<TStateId>;
  private _activeTransitions: Array<TransitionBase<TStateId>> = [];
  private _activeTriggerTransitions: Map<
    TEvent,
    Array<TransitionBase<TStateId>>
  > = new Map<TEvent, Array<TransitionBase<TStateId>>>();

  private _transitionsFromAny: Array<TransitionBase<TStateId>> = [];
  private _triggerTransitionsFromAny = new Map<
    TEvent,
    Array<TransitionBase<TStateId>>
  >();

  public get activeState(): StateBase<TStateId> {
    this.ensureIsInitializedFor("Trying to get the active state");
    return this._activeState;
  }
  public get activeStateName(): TStateId {
    return this.activeState.name;
  }

  public get parentFsm(): IStateMachine {
    return this.fsm;
  }

  private get isRootFsm(): boolean {
    return this.fsm === null || this.fsm === undefined;
  }

  public get hasPendingTransition(): boolean {
    return this._pendingTransition?.isPending ?? false;
  }

  constructor(needsExitTime: boolean = false, isGhostState: boolean = false) {
    super(needsExitTime, isGhostState);
  }

  private ensureIsInitializedFor(context: string): void {
    if (!this._activeState) {
      throw errors.NotInitialized(context);
    }
  }

  public stateCanExit(): void {
    if (!this._pendingTransition || !this._pendingTransition.isPending) return;

    const listener = this._pendingTransition.listener;
    if (this._pendingTransition.isExitTransition) {
      this._pendingTransition = undefined;

      listener?.beforeTransition();
      this.performVerticalTransition();
      listener?.afterTransition();
    } else {
      const state = this._pendingTransition.targetState;

      this._pendingTransition = undefined;
      this.changeState(state, listener);
    }
  }

  private changeState(name: TStateId, listener?: ITransitionListener): void {
    listener?.beforeTransition();
    this._activeState?.onExit();

    let bundle = this._stateBundlesByName.get(name);
    if (!bundle || !bundle.state) {
      throw errors.StateNotFound(`${name}`, "Switching states");
    }

    this._activeTransitions = bundle.transitions || [];
    this._activeTriggerTransitions =
      bundle.triggerToTransitions ||
      new Map<TEvent, Array<TransitionBase<TStateId>>>();

    this._activeState = bundle.state;
    this._activeState.onEnter();

    for (let i = 0, n = this._activeTransitions.length; i < n; i++) {
      this._activeTransitions[i].onEnter();
    }

    this._activeTriggerTransitions.forEach((transitions) => {
      for (let i = 0, n = transitions.length; i < n; i++) {
        transitions[i].onEnter();
      }
    });

    listener?.afterTransition();

    if (this._activeState.isGhostState) {
      this.tryAllDirectTransitions();
    }
  }

  private performVerticalTransition(): void {
    this.fsm?.stateCanExit();
  }

  public requestStateChange(
    name: TStateId,
    forceInstantly: boolean = false,
    listener?: ITransitionListener
  ): void {
    if (!this._activeState.needsExitTime || forceInstantly) {
      this._pendingTransition = undefined;
      this.changeState(name, listener);
    } else {
      this._pendingTransition = createPendingTransitionForState<TStateId>(
        name,
        listener
      );
      this._activeState.onExitRequest();
      // If it can exit, the activeState would call
      // -> state.fsm.stateCanExit() which in turn would call
      // -> fsm.changeState(...)
    }
  }

  public requestExit(
    forceInstantly: boolean = false,
    listener?: ITransitionListener
  ): void {
    if (!this._activeState.needsExitTime || forceInstantly) {
      this._pendingTransition = undefined;
      listener?.beforeTransition();
      this.performVerticalTransition();
      listener?.afterTransition();
    } else {
      this._pendingTransition =
        createPendingTransitionForExit<TStateId>(listener);
      this._activeState.onExitRequest();
    }
  }

  private tryTransition(transition: TransitionBase<TStateId>): boolean {
    if (transition.isExitTransition) {
      if (
        !this.fsm ||
        !this.fsm.hasPendingTransition ||
        !transition.shouldTransition()
      )
        return false;

      this.requestExit(
        transition.forceInstantly,
        transition as ITransitionListener
      );
      return true;
    } else {
      if (!transition.shouldTransition()) return false;

      this.requestStateChange(
        transition.to,
        transition.forceInstantly,
        transition as ITransitionListener
      );
      return true;
    }
  }

  private tryAllGlobalTransitions(): boolean {
    for (let i = 0, n = this._transitionsFromAny.length; i < n; i++) {
      const transition = this._transitionsFromAny[i];

      // Don't transition to the "to" state, if that state is already the active state.
      if (transition.to === this._activeState.name) continue;

      if (this.tryTransition(transition)) return true;
    }

    return false;
  }

  private tryAllDirectTransitions(): boolean {
    for (let i = 0, n = this._activeTransitions.length; i < n; i++) {
      const transition = this._activeTransitions[i];

      if (this.tryTransition(transition)) return true;
    }

    return false;
  }

  public init(): void {
    if (!this.isRootFsm) return;

    this.onEnter();
  }

  public onEnter(): void {
    if (!this._startState.hasState) {
      throw errors.MissingStartState("Running onEnter of the state machine.");
    }

    // Clear any previous pending transition from the last run.
    this._pendingTransition = undefined;

    this.changeState(this._startState.state);

    for (let i = 0, n = this._transitionsFromAny.length; i < n; i++) {
      this._transitionsFromAny[i].onEnter();
    }

    this._triggerTransitionsFromAny.forEach((transitions) => {
      for (let i = 0, n = transitions.length; i < n; i++) {
        transitions[i].onEnter();
      }
    });
  }

  public onLogic(): void {
    this.ensureIsInitializedFor("Running onLogic");

    if (this.tryAllGlobalTransitions()) {
      this._activeState?.onLogic();
      return;
    }

    if (this.tryAllDirectTransitions()) {
      this._activeState?.onLogic();
      return;
    }

    this._activeState?.onLogic();
  }

  public onExit(): void {
    if (this._activeState) {
      this._activeState.onExit();
      // By setting the activeState to null, the state's onExit method won't be called
      // a second time when the state machine enters again (and changes to the start state).
      this._activeState = undefined;
    }
  }

  public onExitRequest(): void {
    if (this._activeState.needsExitTime) this._activeState.onExitRequest();
  }

  public setStartState(name: TStateId): void {
    this._startState = { state: name, hasState: true };
  }

  private getOrCreateStateBundle(
    name: TStateId
  ): StateBundle<TStateId, TEvent> {
    let bundle = this._stateBundlesByName.get(name);

    if (!bundle) {
      bundle = new StateBundle<TStateId, TEvent>();
      this._stateBundlesByName.set(name, bundle);
    }

    return bundle;
  }

  public addState(name: TStateId, state?: StateBase<TStateId>): void {
    state.fsm = this;
    state.name = name;
    state.init();

    const bundle = this.getOrCreateStateBundle(name);
    bundle.state = state;

    if (this._stateBundlesByName.size == 1 && !this._startState.hasState) {
      this.setStartState(name);
    }
  }

  private initTransition(transition: TransitionBase<TStateId>): void {
    transition.fsm = this;
    transition.init();
  }

  public addTransition(transition: TransitionBase<TStateId>): void {
    this.initTransition(transition);

    const bundle = this.getOrCreateStateBundle(transition.from);
    bundle.addTransition(transition);
  }

  public addTransitionFromAny(transition: TransitionBase<TStateId>) {
    this.initTransition(transition);
    this._transitionsFromAny.push(transition);
  }

  public addTriggerTransition(
    trigger: TEvent,
    transition: TransitionBase<TStateId>
  ): void {
    this.initTransition(transition);

    const bundle = this.getOrCreateStateBundle(transition.from);
    bundle.addTriggerTransition(trigger, transition);
  }

  public addTriggerTransitionFromAny(
    trigger: TEvent,
    transition: TransitionBase<TStateId>
  ): void {
    this.initTransition(transition);

    let transitionsOfTrigger = this._triggerTransitionsFromAny.get(trigger);

    if (!transitionsOfTrigger) {
      transitionsOfTrigger = [];
      this._triggerTransitionsFromAny.set(trigger, transitionsOfTrigger);
    }

    transitionsOfTrigger.push(transition);
  }

  public addTwoWayTransition(transition: TransitionBase<TStateId>): void {
    // this.initTransition(transition);
    this.addTransition(transition);

    const reverse = new ReverseTransition<TStateId>(transition, {
      shouldInitWrappedTransition: false,
    });
    // this.initTransition(reverse);
    this.addTransition(reverse);
  }

  public addTwoWayTriggerTransition(
    trigger: TEvent,
    transition: TransitionBase<TStateId>
  ): void {
    this.initTransition(transition);
    this.addTriggerTransition(trigger, transition);

    const reverse = new ReverseTransition<TStateId>(transition, {
      shouldInitWrappedTransition: false,
    });
    this.initTransition(reverse);
    this.addTriggerTransition(trigger, reverse);
  }

  public addExitTransition(transition: TransitionBase<TStateId>): void {
    transition.isExitTransition = true;
    this.addTransition(transition);
  }

  public addExitTransitionFromAny(transition: TransitionBase<TStateId>): void {
    transition.isExitTransition = true;
    this.addTransitionFromAny(transition);
  }

  public addExitTriggerTransition(
    trigger: TEvent,
    transition: TransitionBase<TStateId>
  ): void {
    transition.isExitTransition = true;
    this.addTriggerTransition(trigger, transition);
  }

  public addExitTriggerTransitionFromAny(
    trigger: TEvent,
    transition: TransitionBase<TStateId>
  ): void {
    transition.isExitTransition = true;
    this.addTriggerTransitionFromAny(trigger, transition);
  }

  private tryTrigger(trigger: TEvent): boolean {
    this.ensureIsInitializedFor(
      "Checking all trigger transitions of the active state"
    );

    let triggerTransitions = this._triggerTransitionsFromAny.get(trigger);

    if (triggerTransitions) {
      for (let i = 0, n = triggerTransitions.length; i < n; i++) {
        const transition = triggerTransitions[i];

        if (transition.to === this._activeState.name) continue;

        if (this.tryTransition(transition)) return true;
      }
    }

    triggerTransitions = this._activeTriggerTransitions.get(trigger);
    if (triggerTransitions) {
      for (let i = 0, n = triggerTransitions.length; i < n; i++) {
        const transition = triggerTransitions[i];

        if (this.tryTransition(transition)) return true;
      }
    }

    return false;
  }

  public trigger(trigger: TEvent): void {
    if (this.tryTrigger(trigger)) return;

    (this._activeState as unknown as ITriggerable<TEvent>)?.trigger(trigger);
  }

  public triggerLocally(trigger: TEvent): void {
    this.tryTrigger(trigger);
  }

  public onAction<TData>(trigger: TEvent, data: TData): void {
    this.ensureIsInitializedFor("Running onAction of the active state");
    (this._activeState as unknown as IActionable<TEvent>)?.onAction<TData>(
      trigger,
      data
    );
  }

  public getState(name: TStateId): StateBase<TStateId> {
    let bundle = this._stateBundlesByName.get(name);

    if (!bundle || !bundle.state) {
      throw errors.StateNotFound(String(name), "Getting a state");
    }

    return bundle.state;
  }

  public getActiveHierarchyPath(): string {
    if (!this._activeState) return "";

    return `${this.name}/${this._activeState.getActiveHierarchyPath()}`;
  }
}
