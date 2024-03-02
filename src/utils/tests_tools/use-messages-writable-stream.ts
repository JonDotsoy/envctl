import { messageToText, type Message, globalMessages } from "../streaming";
import { cleanColorTerm } from "./clean-color-term";

export const useMessagesWritableStream = () => {
  let output = ``;
  const unSubs = new Set<() => void>();

  const cb = (message: Message) => {
    output = `${output}${cleanColorTerm(messageToText(message))}`;
  };

  return {
    toText() {
      return output;
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
    [Symbol.dispose]: () => {
      messagesWritableStream[Symbol.dispose]();
    },
  };
};
