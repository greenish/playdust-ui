function range(from: number, to: number, step: number) {
  const newArray = Array<number>(Math.floor((to - from) / step) + 1);
  return [...newArray].map((_, i) => from + i * step);
}

export default range;
