// debounce function
export const debounce = (fn: Function, delay: number) => {
  let timeout: number | undefined = undefined;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
