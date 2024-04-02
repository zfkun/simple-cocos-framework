import { TransitionBase } from "../base/TransitionBase";

export class ReverseTransition<TStateId> extends TransitionBase<TStateId> {
  public wrappedTransition: TransitionBase<TStateId>;
  private _shouldInitWrappedTransition: boolean;

  constructor(
    wrappedTransition: TransitionBase<TStateId>,
    options?: {
      shouldInitWrappedTransition?: boolean;
    }
  ) {
    const { shouldInitWrappedTransition = true } = options || {};

    super(
      wrappedTransition.to,
      wrappedTransition.from,
      wrappedTransition.forceInstantly
    );

    this.wrappedTransition = wrappedTransition;
    this._shouldInitWrappedTransition = shouldInitWrappedTransition;
  }

  public init(): void {
    if (this._shouldInitWrappedTransition) {
      this.wrappedTransition.fsm = this.fsm;
      this.wrappedTransition.init();
    }
  }

  public onEnter(): void {
    this.wrappedTransition.onEnter();
  }

  public shouldTransition(): boolean {
    return !this.wrappedTransition.shouldTransition();
  }

  public beforeTransition() {
    this.wrappedTransition.afterTransition();
  }

  public afterTransition() {
    this.wrappedTransition.beforeTransition();
  }
}
