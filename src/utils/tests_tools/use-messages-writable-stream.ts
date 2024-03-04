import {
  messageToText,
  type Message,
  globalMessages,
  messageToObject,
} from "../streaming";
import { cleanColorTerm } from "./clean-color-term";

export const useMessagesWritableStream = () => {
  let output = ``;
  let messages: Message[] = [];
  const unSubs = new Set<() => void>();

  const cb = (message: Message) => {
    const messageObj = messageToObject(message);
    messages.push({ ...messageObj, value: cleanColorTerm(messageObj.value) });
    output = `${output}${cleanColorTerm(messageToText(message))}`;
  };

  return {
    toText() {
      return output;
    },
    toMessages() {
      return messages;
    },
    connect: (obj: {
      subscribe: (cb: (message: Message) => void) => () => any;
    }) => {
      unSubs.add(obj.subscribe(cb));
    },
    [Symbol.dispose]() {
      for (const unSub of unSubs) {
        unSub();
      }
    },
  };
};

export const useGlobalMessages = () => {
  const messagesWritableStream = useMessagesWritableStream();

  messagesWritableStream.connect(globalMessages);

  return {
    toText: () => messagesWritableStream.toText(),
    toMessages: () => messagesWritableStream.toMessages(),
    [Symbol.dispose]: () => {
      messagesWritableStream[Symbol.dispose]();
    },
  };
};
