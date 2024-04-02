import { IStateMachine, ITransitionListener } from "./interface";

export class TransitionBase<TStateId> implements ITransitionListener {
  public from: TStateId;
  public to: TStateId;

  public forceInstantly: boolean;
  public isExitTransition: boolean;

  public fsm: IStateMachine;

  constructor(from: TStateId, to: TStateId, forceInstantly: boolean = false) {
    this.from = from;
    this.to = to;
    this.forceInstantly = forceInstantly;
    this.isExitTransition = false;
  }

  public init(): void {}

  public onEnter(): void {}

  public shouldTransition(): boolean {
    return true;
  }

  public beforeTransition(): void {}

  public afterTransition(): void {}
}
