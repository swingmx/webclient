// @ts-ignore
import { Gapless5, CrossfadeShape } from "@regosen/gapless-5";

const player = new Gapless5({
  loadLimit: 3,
  crossfade: 2000,
  crossfadeShape: CrossfadeShape.EqualPower,
});

export default player;
