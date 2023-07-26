// @ts-ignore
import { Gapless5, CrossfadeShape, LogLevel } from "@regosen/gapless-5";

const player = new Gapless5({
  loadLimit: 2,
  crossfade: 3000,
  crossfadeShape: CrossfadeShape.EqualPower,
  useWebAudio: false,
  // logLevel: LogLevel.Debug,
});

export default player;
