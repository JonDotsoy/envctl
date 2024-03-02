export const cleanColorTerm = (str: string) => {
  let closedUntil: number = -1;
  return new TextDecoder().decode(
    new Uint8Array(
      Array.from(new TextEncoder().encode(str)).flatMap(
        (charCode, index, a) => {
          if (index < closedUntil) return [];
          if (charCode === 0x1b) {
            const closingSymbol = a.indexOf(0x6d, index);
            closedUntil = closingSymbol + 1;
            return [];
          }
          return charCode;
        },
      ),
    ),
  );
};
