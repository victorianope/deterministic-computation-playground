interface RandomSample {
  mean: number;
  stdDev: number;
}

interface SolutionProps {
  x: RandomSample;
  y: RandomSample;
  samples?: number;
}

/* sampleNormDist takes 2 input values
  @mean: a value that represents the center of our target distribution
  @stdDev: a value that represents the "noise" or spread of our target distribution

  with these two values, we pass it through the Box-Muller transform (https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform) 
  to turn uniform random numbers into normally distributed random numbers in order to obtain
  a more natural variation thanks to the noise that a normal distribution introduces
*/
function sampleNormDist({ mean, stdDev }: RandomSample) {
  // Make sure u1 > 0 to avoid ln(0) which would invalidate the result
  const u1 = Math.max(Math.random(), Number.EPSILON);
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

  return mean + z * stdDev;
}

export function getMonteCarloSolution({
  x,
  y,
  samples = 1000,
}: SolutionProps): RandomSample {
  const results: Array<number> = [];

  for (let it = 0; it < samples; it++) {
    const sampleX = sampleNormDist(x);
    const sampleY = sampleNormDist(y);

    results.push(sampleX + sampleY);
  }

  const mean = results.reduce((sum, val) => sum + val, 0) / (samples - 1);
  const variance =
    results.reduce((sum, val) => sum + (val - mean) ** 2, 0) / (samples - 1);

  return { mean, stdDev: Math.sqrt(variance) };
}

export function getDeterministicPropagationSolution({
  x,
  y,
}: SolutionProps): RandomSample {
  return {
    mean: x.mean + y.mean,
    stdDev: Math.sqrt(x.stdDev ** 2 + y.stdDev ** 2),
  };
}
