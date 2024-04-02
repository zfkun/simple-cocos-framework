export interface IStateMachine {
  stateCanExit(): void;

  get hasPendingTransition(): boolean;

  get parentFsm(): IStateMachine;
}

export interface ITransitionListener {
  beforeTransition(): void;
  afterTransition(): void;
}

export interface IActionable<TEvent> {
  onAction<TData>(trigger: TEvent, data: TData): void;
}

export interface ITriggerable<TEvent> {
  trigger(trigger: TEvent): void;
}
