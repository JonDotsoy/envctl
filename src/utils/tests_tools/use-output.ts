import { readableStreamToText } from "bun";

export const useOutput = async () => {
  const outputControllerPromise =
    Promise.withResolvers<Bun.ReadableStreamController<string>>();
  const outputStream = new ReadableStream<string>({
    start: (controller) => outputControllerPromise.resolve(controller),
  });
  const outputController = await outputControllerPromise.promise;

  let alreadyClosed = false;
  const close = () => {
    if (!alreadyClosed) {
      outputController.close();
      alreadyClosed = true;
    }
  };

  return {
    send: (message: string) => outputController.enqueue(message),
    close: close,
    subscribeReadable: (readable: ReadableStream<string>) =>
      readable.pipeTo(
        new WritableStream<string>({
          write: (message) => outputController.enqueue(message),
        }),
      ),
    stream: outputStream,
    controller: outputController,
    toText: () => readableStreamToText(outputStream),
    [Symbol.dispose]: () => {
      close();
    },
  };
};
