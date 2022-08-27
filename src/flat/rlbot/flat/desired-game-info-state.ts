// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import { Bool, BoolT } from '../../rlbot/flat/bool';
import { Float, FloatT } from '../../rlbot/flat/float';


export class DesiredGameInfoState {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):DesiredGameInfoState {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsDesiredGameInfoState(bb:flatbuffers.ByteBuffer, obj?:DesiredGameInfoState):DesiredGameInfoState {
  return (obj || new DesiredGameInfoState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsDesiredGameInfoState(bb:flatbuffers.ByteBuffer, obj?:DesiredGameInfoState):DesiredGameInfoState {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new DesiredGameInfoState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

worldGravityZ(obj?:Float):Float|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? (obj || new Float()).__init(this.bb_pos + offset, this.bb!) : null;
}

gameSpeed(obj?:Float):Float|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? (obj || new Float()).__init(this.bb_pos + offset, this.bb!) : null;
}

paused(obj?:Bool):Bool|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? (obj || new Bool()).__init(this.bb_pos + offset, this.bb!) : null;
}

endMatch(obj?:Bool):Bool|null {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? (obj || new Bool()).__init(this.bb_pos + offset, this.bb!) : null;
}

static startDesiredGameInfoState(builder:flatbuffers.Builder) {
  builder.startObject(4);
}

static addWorldGravityZ(builder:flatbuffers.Builder, worldGravityZOffset:flatbuffers.Offset) {
  builder.addFieldStruct(0, worldGravityZOffset, 0);
}

static addGameSpeed(builder:flatbuffers.Builder, gameSpeedOffset:flatbuffers.Offset) {
  builder.addFieldStruct(1, gameSpeedOffset, 0);
}

static addPaused(builder:flatbuffers.Builder, pausedOffset:flatbuffers.Offset) {
  builder.addFieldStruct(2, pausedOffset, 0);
}

static addEndMatch(builder:flatbuffers.Builder, endMatchOffset:flatbuffers.Offset) {
  builder.addFieldStruct(3, endMatchOffset, 0);
}

static endDesiredGameInfoState(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}


unpack(): DesiredGameInfoStateT {
  return new DesiredGameInfoStateT(
    (this.worldGravityZ() !== null ? this.worldGravityZ()!.unpack() : null),
    (this.gameSpeed() !== null ? this.gameSpeed()!.unpack() : null),
    (this.paused() !== null ? this.paused()!.unpack() : null),
    (this.endMatch() !== null ? this.endMatch()!.unpack() : null)
  );
}


unpackTo(_o: DesiredGameInfoStateT): void {
  _o.worldGravityZ = (this.worldGravityZ() !== null ? this.worldGravityZ()!.unpack() : null);
  _o.gameSpeed = (this.gameSpeed() !== null ? this.gameSpeed()!.unpack() : null);
  _o.paused = (this.paused() !== null ? this.paused()!.unpack() : null);
  _o.endMatch = (this.endMatch() !== null ? this.endMatch()!.unpack() : null);
}
}

export class DesiredGameInfoStateT {
constructor(
  public worldGravityZ: FloatT|null = null,
  public gameSpeed: FloatT|null = null,
  public paused: BoolT|null = null,
  public endMatch: BoolT|null = null
){}


pack(builder:flatbuffers.Builder): flatbuffers.Offset {
  DesiredGameInfoState.startDesiredGameInfoState(builder);
  DesiredGameInfoState.addWorldGravityZ(builder, (this.worldGravityZ !== null ? this.worldGravityZ!.pack(builder) : 0));
  DesiredGameInfoState.addGameSpeed(builder, (this.gameSpeed !== null ? this.gameSpeed!.pack(builder) : 0));
  DesiredGameInfoState.addPaused(builder, (this.paused !== null ? this.paused!.pack(builder) : 0));
  DesiredGameInfoState.addEndMatch(builder, (this.endMatch !== null ? this.endMatch!.pack(builder) : 0));

  return DesiredGameInfoState.endDesiredGameInfoState(builder);
}
}