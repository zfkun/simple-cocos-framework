import { _decorator, Component, director, Game, game, Node } from "cc";

import scf from "./scf";
import TimerManager from "./manager/timer/TimerManager";
import GameManager from "./manager/game/GameManager";
import { EventType } from "./manager/event/types";

const { ccclass, property } = _decorator;

@ccclass("Root")
export class Root extends Component {
  /** 游戏层 */
  @property({ type: Node, tooltip: "游戏层" })
  private game: Node = null!;

  /** UI层 */
  @property({ type: Node, tooltip: "UI层" })
  private ui: Node = null!;

  /** 持久层 */
  private _persistRoot: Node = null!;

  onLoad(): void {
    this.enabled = false;

    setTimeout(() => {
      this.enabled = true;

      this.init();
      this.run();
    }, 1000);
  }

  protected init(): void {
    this._persistRoot = new Node("PersistRoot");
    director.addPersistRootNode(this._persistRoot);

    scf.timer = this._persistRoot.addComponent(TimerManager);
    scf.game = new GameManager(this.game);

    this.initUi?.();
    this.initGame?.();

    game.on(Game.EVENT_SHOW, this.onGameShow, this);
    game.on(Game.EVENT_HIDE, this.onGameHide, this);

    this.onInit?.();
  }

  protected run(): void {}

  protected initUi(): void {}

  protected initGame(): void {}

  protected onInit?(): void;

  protected onGameShow(): void {
    // scf.timer.resume();
    // scf.audio.resume();

    director.resume();
    game.resume();

    scf.event.emit(EventType.GAME_SHOW);
  }

  protected onGameHide(): void {
    // scf.timer.pause();
    // scf.audio.pause();

    director.pause();
    game.pause();

    scf.event.emit(EventType.GAME_HIDE);
  }
}
