export interface OptionsType {
  events: EventArray[];
  pattern?: string;
  timezone?: string;
}
interface EventArray {
  name: string;
  startIn: string;
  endIn: string;
}
