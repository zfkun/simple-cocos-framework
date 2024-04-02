import { Director, director } from "cc";

let inited = false;
export const init = () => {
  if (inited) return;
  inited = true;

  director.on(Director.EVENT_BEGIN_FRAME, () => {
    frame++;
  });
};

let frame = 1;
export const getCurrentFrame = () => frame;
