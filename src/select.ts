export const createUrlSelection = (
  text: string,
  start: number,
  end: number
) => {
  const reStart = new RegExp("(https?:\\/\\/[\\w\\.\\/\\?=&]*)", "g");
  const matchedList = text.matchAll(reStart);

  for (const matched of matchedList) {
    if (
      matched.index !== undefined &&
      isBetween(
        { start: matched.index, end: matched.index + matched[0].length },
        { start: start, end: end }
      )
    ) {
      return { start: matched.index, end: matched.index + matched[0].length };
    }
  }
  return undefined;
};

type Pos = {
  start: number;
  end: number;
};

const isBetween = (matched: Pos, selected: Pos) => {
  if (matched.start > selected.start && matched.start > selected.end) {
    return false;
  }
  if (matched.end < selected.start && matched.end < selected.end) {
    return false;
  }
  return true;
};
