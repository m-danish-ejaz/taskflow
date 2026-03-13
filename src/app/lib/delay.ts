export const delay = (min = 1000, max = 3000) => {
  const time = Math.random() * (max - min) + min;
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const delayMutation = () =>
  new Promise((res) =>
    setTimeout(res, Math.random() * 2000 + 3000)
  );