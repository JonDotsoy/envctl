import { config } from "dotenv";
import { expect } from "bun:test";

config();

expect(process.env.FOO).toEqual("biz taz");
expect(process.env.BIZ).toEqual("aaa\nbbb");
