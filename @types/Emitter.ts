import { EventEmitter } from "events";
import { EventType } from "./EventType";

export interface Emitter extends EventEmitter {
  on(event: "eventStarted", listener: (event: EventType) => void): this;
  on(event: "eventEnded", listener: (event: EventType) => void): this;
  emit(event: "eventStarted", listener: EventType): boolean;
  emit(event: "eventEnded", listener: EventType): boolean;
}
