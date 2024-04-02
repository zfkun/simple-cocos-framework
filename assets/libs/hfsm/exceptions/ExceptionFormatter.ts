export const format = (
  context?: string,
  problem?: string,
  solution?: string
) => {
  let message = "\n";

  if (context != null) {
    message += `Context: ${context}"\n"`;
  }

  if (problem != null) {
    message += `Problem: ${problem}"\n"`;
  }

  if (solution != null) {
    message += `Solution: ${solution}"\n"`;
  }

  return message;
};
