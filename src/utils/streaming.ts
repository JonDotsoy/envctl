export type MessageText = string;
export type MessageObject = {
  type: "INFO" | "LOG" | "ERROR";
  value: MessageText;
};
export type Message = MessageText | MessageObject;
export type Streaming = ReadableStream<Message>;
export const isMessageText = (value: Message): value is MessageText =>
  typeof value === "string";
export const isMessageObject = (value: Message): value is MessageObject =>
  typeof value === "object";

export const messageToText = (message: Message): MessageText =>
  isMessageText(message) ? message : message.value;
export const messageToObject = (message: Message): MessageObject =>
  isMessageObject(message) ? message : { type: "LOG", value: message };

export const streamingToArray = async (streaming: Streaming) => {
  return (await Array.fromAsync(streaming, messageToObject)) as MessageObject[];
};

class GlobalMessages {
  private readablePromise =
    Promise.withResolvers<Bun.ReadableStreamController<Message>>();

  private subs = new Set<(message: Message) => any>();

  readonly writableSubs = new WritableStream<Message>({
    write: (message) => {
      for (const sub of this.subs) {
        sub(message);
      }
    },
  });

  readonly readable = new ReadableStream<Message>({
    start: (controller) => {
      this.readablePromise.resolve(controller);
    },
  }).pipeTo(this.writableSubs);

  async getController() {
    return this.readablePromise.promise;
  }

  async close() {
    const controller = await this.getController();
    controller.close();
  }

  subscribe(cb: (message: Message) => any) {
    this.subs.add(cb);
    return () => {
      this.subs.delete(cb);
    };
  }
}

export const globalMessages = new GlobalMessages();

export const useMessages = async () => {
  const controller = await globalMessages.getController();

  const send = (message: Message) =>
    controller.enqueue(messageToObject(message));

  return {
    send,
  };
};

export const catchToMessages = async (cb: () => Promise<void>) => {
  const messages = await useMessages();

  try {
    return await cb();
  } catch (ex) {
    if (ex instanceof Error)
      return messages.send({ type: "ERROR", value: `${ex.message}\n` });
    throw ex;
  }
};
