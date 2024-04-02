import { IStateMachine } from "./interface";

export class StateBase<TStateId> {
  public needsExitTime: boolean;
  public isGhostState: boolean;
  public name: TStateId;
  public fsm: IStateMachine;

  constructor(needsExitTime: boolean, isGhostState: boolean = false) {
    this.needsExitTime = needsExitTime;
    this.isGhostState = isGhostState;
  }

  public init(): void {}

  public onEnter(): void {}

  public onLogic(): void {}

  public onExit(): void {}

  public onExitRequest(): void {}

  public getActiveHierarchyPath(): string {
    return `${this.name}`;
  }
}
