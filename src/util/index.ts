export * from "./cn";

export const chunk = <T>(list: T[], size: number): T[][] => {
  const chunkCount = Math.ceil(list.length / size);
  return new Array(chunkCount).fill(null).map((_c: null, i: number) => {
    return list.slice(i * size, i * size + size);
  });
};

export const shuffle = <T>(list: T[]): T[] => {
  return list.sort(() => 0.5 - Math.random());
  // return list;
};
