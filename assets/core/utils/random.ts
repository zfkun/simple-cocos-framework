/**
 * 打乱数组排序
 *
 * @param arr 目标数组
 * @returns
 */
export const shuffle = (arr: number[]): number[] => {
  let m = arr.length,
    t: number,
    i: number;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
};

/**
 * 生成非完全连续结果集
 *
 * 确保生成结果一定非 升序 且 连续 (如: [0, 1, 2, 3 ...])
 *
 * 例如: [0, 1, 2, 3, 4, 5]  =>  [3, 0, 5, 1, 4, 2]
 *
 * @param arr 目标数组
 * @returns
 */
export const shuffleDiscontinuity = (arr: number[]): number[] => {
  let m = shuffle(arr);

  const n = m.length - 1;
  for (let i = 0; i < n; i++) {
    if (m[i] + 1 !== m[i + 1]) {
      return m;
    }
  }

  return shuffleDiscontinuity(arr);
};
