import { test, expect } from "bun:test";
import { useChdir, useWorkspace } from "./utils/common_tests";
import { cli } from "./cli";
import { catchToMessages } from "./utils/streaming";
import { useGlobalMessages } from "./utils/tests_tools/use-messages-writable-stream";

test("run cli", async () => {
  const { workspaceLocation, writeFile } = await useWorkspace();
  using _chdir = useChdir(workspaceLocation);
  using messagesWritableStream = useGlobalMessages();

  await writeFile(".env.local", new TextEncoder().encode("FOO=biz"));
  await writeFile(".env.template", new TextEncoder().encode("FOO=taz"));

  await catchToMessages(() => cli([]));

  expect(messagesWritableStream.toText()).toMatchSnapshot();
});

test("run use local env (using full path)", async () => {
  const { workspaceLocation, writeFile, readFile } = await useWorkspace();
  using _chdir = useChdir(workspaceLocation);
  using messagesWritableStream = useGlobalMessages();

  await writeFile(".env.local", new TextEncoder().encode("FOO=biz"));
  await writeFile(".env.template", new TextEncoder().encode("FOO=taz"));

  await catchToMessages(() => cli(["use", ".env.local"]));

  expect(messagesWritableStream.toText()).toMatchSnapshot();
  expect(new TextDecoder().decode(await readFile(".env"))).toMatchSnapshot();
});

test("run use local env (using partial path)", async () => {
  const { workspaceLocation, writeFile, readFile } = await useWorkspace();
  using _chdir = useChdir(workspaceLocation);
  using messagesWritableStream = useGlobalMessages();

  await writeFile(".env.local", new TextEncoder().encode("FOO=biz"));
  await writeFile(".env.template", new TextEncoder().encode("FOO=taz"));

  await catchToMessages(() => cli(["use", "local"]));

  expect(messagesWritableStream.toText()).toMatchSnapshot();
  expect(new TextDecoder().decode(await readFile(".env"))).toMatchSnapshot();
});

test("run use local env (using subpath location)", async () => {
  const { workspaceLocation, writeFile, readFile } = await useWorkspace();
  using _chdir = useChdir(workspaceLocation);
  using messagesWritableStream = useGlobalMessages();

  await writeFile(".envs/local.env", new TextEncoder().encode("FOO=biz"));
  await writeFile(".env.template", new TextEncoder().encode("FOO=taz"));

  await catchToMessages(() => cli(["use", ".envs/local.env"]));

  expect(messagesWritableStream.toText()).toMatchSnapshot();
  expect(new TextDecoder().decode(await readFile(".env"))).toMatchSnapshot();
});

test("run use local env (using subpath relative location)", async () => {
  const { workspaceLocation, writeFile, readFile } = await useWorkspace();
  using _chdir = useChdir(workspaceLocation);
  using messagesWritableStream = useGlobalMessages();

  await writeFile(".envs/local.env", new TextEncoder().encode("FOO=biz"));
  await writeFile(".env.template", new TextEncoder().encode("FOO=taz"));

  await catchToMessages(() => cli(["use", "local"]));

  expect(messagesWritableStream.toText()).toMatchSnapshot();
  expect(new TextDecoder().decode(await readFile(".env"))).toMatchSnapshot();
});

test("should call to envctl list and display all envs files found", async () => {
  const workspace = await useWorkspace();
  using _chdir = useChdir(workspace.workspaceLocation);
  using messages = useGlobalMessages();

  await workspace.writeFile(".env.template", new TextEncoder().encode(``));
  await workspace.writeFile(".envs/template", new TextEncoder().encode(``));

  await workspace.writeFile(".env.aaa", new TextEncoder().encode(``));
  await workspace.writeFile(".bbb.env", new TextEncoder().encode(``));
  await workspace.writeFile(".envs/ccc", new TextEncoder().encode(``));
  await workspace.writeFile(".envs/.ddd", new TextEncoder().encode(``));
  await workspace.writeFile(".envs/eee.env", new TextEncoder().encode(``));
  await workspace.writeFile(".envs/.fff.env", new TextEncoder().encode(``));

  await catchToMessages(() => cli(["list"]));

  await new Promise((r) => setTimeout(r, 100));
  expect(messages.toText()).toMatchSnapshot();
});

test("should call to envctl list and display json output", async () => {
  const workspace = await useWorkspace();
  using _chdir = useChdir(workspace.workspaceLocation);
  using messages = useGlobalMessages();

  await workspace.writeFile(".env.template", new TextEncoder().encode(``));
  await workspace.writeFile(".envs/template", new TextEncoder().encode(``));

  await catchToMessages(() => cli(["list", "-j"]));

  await new Promise((r) => setTimeout(r, 100));
  expect(messages.toMessages()).toMatchSnapshot();
});

test("should call to envctl version to display version number", async () => {
  const workspace = await useWorkspace();
  using _chdir = useChdir(workspace.workspaceLocation);
  using messages = useGlobalMessages();

  await catchToMessages(() => cli(["version"]));

  await new Promise((r) => setTimeout(r, 100));
  expect(JSON.stringify(messages.toMessages())).toMatch(
    /Version v\d+\.\d+\.\d+/,
  );
});

test("should call to envctl version to display version number (json output)", async () => {
  const workspace = await useWorkspace();
  using _chdir = useChdir(workspace.workspaceLocation);
  using messages = useGlobalMessages();

  await catchToMessages(() => cli(["version", "--json"]));

  await new Promise((r) => setTimeout(r, 100));
  expect(JSON.stringify(messages.toMessages())).toMatch(`\\"version\\":`);
  expect(JSON.stringify(messages.toMessages())).toMatch(/\d+\.\d+\.\d+/);
});
