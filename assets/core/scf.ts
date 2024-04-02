import { DEBUG } from "cc/env";

import EventManager from "./manager/event/EventManager";
import TimerManager from "./manager/timer/TimerManager";
import ResManager from "./manager/loader/ResManager";
import GameManager from "./manager/game/GameManager";
import AudioManager from "./manager/sound/AudioManager";

const version = "1.0.0";

/** 全局事件管理器 */
const event: EventManager = new EventManager();
/** 全局资源管理器 */
const res: ResManager = new ResManager();
/** 全局音频管理器 */
const audio: AudioManager = new AudioManager();
/** 全局定时器管理器 */
let timer: TimerManager;
/** 全局游戏管理器 */
let game: GameManager;

const scf = {
  version,

  event,
  res,
  timer,
  audio,
  game,
};

if (DEBUG) {
  window["scf"] = scf;
}

export default scf;
