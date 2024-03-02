import { cli } from "./cli";
import {
  catchToMessages,
  globalMessages,
  messageToObject,
} from "./utils/streaming";

const args = process.argv.slice(2);

globalMessages.subscribe((message) => {
  const { type, value } = messageToObject(message);
  if (type === "LOG") process.stdout.write(value);
  else process.stderr.write(value);
});

await catchToMessages(() => cli(args));
