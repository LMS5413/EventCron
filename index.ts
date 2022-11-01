import { OptionsType } from "./@types/OptionsType";
import EventEmitter from "events";
import { Emitter } from "./@types/Emitter";
import cron from "node-cron";
import { RegexValidatorError } from "./Errors/RegexValidator";
import { TimezoneError } from "./Errors/TimezoneError";
import axios from "axios";

export class EventCron {
  options: OptionsType;
  constructor(options: OptionsType) {
    this.options = options;
  }
  async start() {
    if (this.options.pattern && !cron.validate(this.options.pattern)) {
      throw new RegexValidatorError("Invalid pattern \nLocale: Cron pattern");
    }
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (
      this.options.events.find(
        (x) => !regex.test(x.startIn) || !regex.test(x.endIn)
      )
    ) {
      throw new RegexValidatorError(
        `Invalid pattern \nLocale: Events > ${
          this.options.events.find((x) => !regex.test(x.startIn))
            ? "Start In"
            : "End In"
        }`
      );
    }
    const emitter = new EventEmitter() as Emitter;
    if (this.options.timezone) {
      const timezones = (
        await axios.get(
          "https://raw.githubusercontent.com/dmfilipenko/timezones.json/master/timezones.json"
        )
      ).data as any[];
      if (!timezones.find((x) => x.value === this.options.timezone)) {
        throw new TimezoneError(
          "Timezone is invalid.",
          this.options.timezone,
          timezones
            .map((x) => x.utc)
            .reduce((acc, curr) => acc.concat(curr), [])
        );
      }
    }
    let timezoneConfig = {
      schedule: true,
      timezone: this.options.timezone || undefined,
    };
    cron.schedule(
      this.options.pattern ?? "0 0 * * *",
      () => {
        this.options.events.forEach((event, index) => {
          const actualDate = `${new Date().getDate()}/${
            new Date().getMonth() + 1
          }/${new Date().getFullYear()}`;
          const date = {
            start: `${parseInt(event.startIn.split("/")[0])}/${event.startIn
              .split("/")
              .slice(1)
              .join("/")}`,
            end: `${parseInt(event.endIn.split("/")[0])}/${event.endIn
              .split("/")
              .slice(1)
              .join("/")}`,
          };
          if (actualDate === date.start) {
            emitter.emit("eventStarted", { name: event.name, index });
          }
          if (actualDate === date.end) {
            emitter.emit("eventEnded", { name: event.name, index });
          }
        });
      },
      timezoneConfig
    );
    return emitter as Emitter;
  }
}
