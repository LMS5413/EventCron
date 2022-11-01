import { OptionsType } from "./@types/OptionsType";
import EventEmitter from "events";
import { Emitter } from "./@types/Emitter";
import cron from "node-cron";
import { RegexValidatorError } from "./Errors/RegexValidator";
import { TimezoneError } from "./Errors/TimezoneError";
import axios from "axios";

export class EventCron {
  private options: OptionsType;
  constructor(options: OptionsType) {
    this.options = options;
  }
  async start() {
    return new Promise<Emitter>(async (resolve, reject) => {
      if (this.options.pattern && !cron.validate(this.options.pattern)) {
        reject(
          new RegexValidatorError("Invalid pattern \nLocale: Cron pattern")
        );
      }
      if (
        this.options.events.find(
          (x) =>
            !/^(\d{2})\/(\d{2})(:)?/g.test(x.startIn) ||
            !/^(\d{2})\/(\d{2})(:)?/g.test(x.endIn)
        )
      ) {
        reject(
          new RegexValidatorError(
            `Invalid pattern \nLocale: Events > ${
              this.options.events.find(
                (x) => !/^(\d{2})\/(\d{2})(:)?/g.test(x.startIn)
              )
                ? "Start In"
                : "End In"
            }`
          )
        );
      }
      const emitter: Emitter = new EventEmitter();
      if (this.options.timezone) {
        const timezones = (
          await axios.get(
            "https://raw.githubusercontent.com/dmfilipenko/timezones.json/master/timezones.json"
          )
        ).data as any[];
        if (
          !timezones
            .map((x) => x.utc)
            .reduce((acc, curr) => acc.concat(curr), [])
            .find((x: string) => x === this.options.timezone)
        ) {
          reject(
            new TimezoneError(
              "Timezone is invalid.",
              this.options.timezone,
              timezones
                .map((x) => x.utc)
                .reduce((acc, curr) => acc.concat(curr), [])
            )
          );
        }
      }
      let timezoneConfig = {
        schedule: true,
        timezone: this.options.timezone || process.env.TZ,
      };
      cron.schedule(
        this.options.pattern ?? "0 0 * * *",
        () => {
          this.options.events.forEach((event, index) => {
            const actualDate = `${new Date().getDate()}/${
              new Date().getMonth() + 1
            }/${new Date().getFullYear()}`;
            const date = {
              start: `${event.endIn.split("/").map(x => parseInt(x)).join("/")}`,
              end: `${event.endIn.split("/").map(x => parseInt(x)).join("/")}`,
              hourStart: event.startIn.split(":").map(x => parseInt(x)).slice(1).join(":"),
              hourEnd: event.endIn.split(":").map(x => parseInt(x)).slice(1).join(":"),
            };
            if (actualDate === date.start) {
              if (!date.hourStart) {
                emitter.emit("eventStarted", { name: event.name, index });
              } else {
                const hour = `${new Date().getHours()}:${new Date().getMinutes()}`;
                if (hour === date.hourStart) {
                  emitter.emit("eventStarted", { name: event.name, index });
                }
              }
            }
            if (actualDate === date.end) {
              if (!date.hourEnd) {
                emitter.emit("eventEnded", { name: event.name, index });
              } else {
                const hour = `${new Date().getHours()}:${new Date().getMinutes()}`;
                if (hour === date.hourEnd) {
                  emitter.emit("eventEnded", { name: event.name, index });
                }
              }
            }
          });
        },
        timezoneConfig
      );
      return resolve(emitter);
    });
  }
}
