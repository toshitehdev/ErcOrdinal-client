export const trimString = (string) => {
  const stringStart = string.slice(0, 5);
  const stringEnd = string.slice(38, 42);
  return stringStart + "..." + stringEnd;
};
