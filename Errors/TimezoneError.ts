export class TimezoneError extends Error {
  constructor(message: string, timezone: string, timezones: string[]) {
    super(
      `${message}${
        didYouMean(timezone, timezones)
          ? ` Did you mean ${didYouMean(timezone, timezones)}?`
          : ""
      }`
    );
    this.name = "TimezoneInvalid";
  }
}
function didYouMean(str: string, array: string[], threshold = 60) {
  //DidYouMan function: https://github.com/5antos/JS-Randomness/blob/master/stringSimilarity.js
  const acceptable = array
    .map((e) => {
      return { e, v: checkSimilarity(str, e) };
    })
    .filter(({ v }) => v >= threshold / 100);

  return !acceptable.length
    ? null
    : acceptable.reduce((acc, curr) => (curr.v > acc.v ? curr : acc)).e;
}
function checkSimilarity(str1: string, str2: string) {
  if (str1 === str2) return 1.0;

  const len1 = str1.length;
  const len2 = str2.length;

  const maxDist = ~~(Math.max(len1, len2) / 2) - 1;
  let matches = 0;

  const hash1 = [];
  const hash2 = [];

  for (var i = 0; i < len1; i++)
    for (
      var j = Math.max(0, i - maxDist);
      j < Math.min(len2, i + maxDist + 1);
      j++
    )
      if (str1.charAt(i) === str2.charAt(j) && !hash2[j]) {
        hash1[i] = 1;
        hash2[j] = 1;
        matches++;
        break;
      }

  if (!matches) return 0.0;

  let t = 0;
  let point = 0;

  for (var k = 0; k < len1; k++)
    if (hash1[k]) {
      while (!hash2[point]) point++;

      if (str1.charAt(k) !== str2.charAt(point++)) t++;
    }

  t /= 2;

  return (matches / len1 + matches / len2 + (matches - t) / matches) / 3.0;
}
