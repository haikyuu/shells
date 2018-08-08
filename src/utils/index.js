export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
};
export const waitFor = ms => new Promise(resolve => setTimeout(resolve, ms));

export const getRandomPair = array => {
  const i = array[getRandomIntInclusive(0, array.length - 1)];
  const j = array.filter(el => el !== i)[
    getRandomIntInclusive(0, array.length - 2)
  ];
  return { i, j };
};
