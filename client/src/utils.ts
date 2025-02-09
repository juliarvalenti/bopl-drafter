export const cn = (
  ...args: (string | string[] | { [key: string]: boolean })[]
): string => {
  const classes: string[] = [];

  args.forEach((arg) => {
    if (typeof arg === "string") {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      classes.push(...arg);
    } else if (typeof arg === "object" && arg !== null) {
      Object.keys(arg).forEach((key) => {
        if (arg[key]) {
          classes.push(key);
        }
      });
    }
  });

  return classes.join(" ");
};
