import { red } from "chalk";

export class RegexValidatorError extends Error {
  constructor(message: string) {
    super(red(`\n${message}`));
    this.name = "RegexValidatorError";
  }
}
