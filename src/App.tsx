import { useCallback, useEffect, useState } from "react";
import { DataResults, type DataResultsProps } from "./components/DataResults";
import {
  getDeterministicPropagationSolution,
  getMonteCarloSolution,
} from "./utils/DeterministicSolvers";
import { DataSlider } from "./components/DataSlider";

const DEFAULT_DATA_RESULT: DataResultsProps = {
  mean: 0,
  error: 0,
  samples: 0,
};

function calculateError({
  theoreticalValue,
  trueValue,
}: {
  theoreticalValue: number;
  trueValue: number;
}): number {
  return Number(
    ((100 * Math.abs(theoreticalValue - trueValue)) / trueValue).toFixed(4),
  );
}

function App() {
  const [iterations, setIterations] = useState(1000);

  const [valueA, setValueA] = useState(10);
  const [uncertaintyA, setUncertaintyA] = useState(2);

  const [valueB, setValueB] = useState(5);
  const [uncertaintyB, setUncertaintyB] = useState(1);

  const [monteCarloResult, setMonteCarloResult] =
    useState<DataResultsProps>(DEFAULT_DATA_RESULT);
  const [deterministicResult, setDeterministicResult] =
    useState<DataResultsProps>(DEFAULT_DATA_RESULT);

  // Use callbacks to avoid unnecessary re-calculations
  const callbackMonteCarlo = useCallback(() => {
    return getMonteCarloSolution({
      x: { mean: valueA, stdDev: uncertaintyA },
      y: { mean: valueB, stdDev: uncertaintyB },
      samples: iterations,
    });
  }, [iterations, uncertaintyA, uncertaintyB, valueA, valueB]);

  const callbackDeterministic = useCallback(() => {
    return getDeterministicPropagationSolution({
      x: { mean: valueA, stdDev: uncertaintyA },
      y: { mean: valueB, stdDev: uncertaintyB },
    });
  }, [uncertaintyA, uncertaintyB, valueA, valueB]);

  useEffect(() => {
    // Run both methods on page load to have some data on display
    const mC = callbackMonteCarlo();
    const det = callbackDeterministic();
    setMonteCarloResult({
      mean: mC.mean,
      error: calculateError({
        theoreticalValue: mC.mean,
        trueValue: valueA + valueB,
      }),
      samples: iterations,
    });
    setDeterministicResult({
      mean: det.mean,
      error: calculateError({
        theoreticalValue: det.mean,
        trueValue: valueA + valueB,
      }),
      samples: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mC = callbackMonteCarlo();
    const det = callbackDeterministic();
    setMonteCarloResult({
      mean: mC.mean,
      error: calculateError({
        theoreticalValue: mC.mean,
        trueValue: valueA + valueB,
      }),
      samples: iterations,
    });
    setDeterministicResult({
      mean: det.mean,
      error: calculateError({
        theoreticalValue: det.mean,
        trueValue: valueA + valueB,
      }),
      samples: 1,
    });
  }, [
    callbackDeterministic,
    callbackMonteCarlo,
    iterations,
    uncertaintyA,
    uncertaintyB,
    valueA,
    valueB,
  ]);

  return (
    <div className="flex flex-col gap-8 mt-4 w-full md:w-5/6 px-4 md:px-0 self-center">
      <div className="-mb-2">
        <h1>Distribution-based Computation Playground</h1>
      </div>

      <div className="flex flex-col gap-8">
        <p>
          While Monte Carlo methods rely on repeated random sampling, while
          deterministic approaches operate directly on distributions, avoiding
          sampling and reducing computational costs.
        </p>
        <p>
          In this demo, we can observe how Monte Carlo estimates change with
          sample size when computing the sum of two uncertain values, and
          compare them to a deterministic result. This highlights the trade-offs
          between sampling-based methods and direct distribution-based
          computation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <p className="text-2xl font-bold">Monte Carlo estimation</p>
          <DataResults data={monteCarloResult} />
        </div>
        <div>
          <p className="text-2xl font-bold">Deterministic propagation</p>
          <DataResults data={deterministicResult} />
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold">Customize the results!</p>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <DataSlider
              data={{
                title: `Mean A value (n = ${valueA})`,
                value: valueA,
                setter: setValueA,
              }}
            />
            <DataSlider
              data={{
                title: `Noise A value (n = ${uncertaintyA})`,
                value: uncertaintyA,
                setter: setUncertaintyA,
              }}
            />
          </div>
          <div>
            <DataSlider
              data={{
                title: `Iterations (n = ${iterations})`,
                value: iterations,
                setter: setIterations,
                min: 100,
                max: 3000,
              }}
            />
          </div>
          <div>
            <DataSlider
              data={{
                title: `Mean B value (n = ${valueB})`,
                value: valueB,
                setter: setValueB,
              }}
            />
            <DataSlider
              data={{
                title: `Noise B value (n = ${uncertaintyB})`,
                value: uncertaintyB,
                setter: setUncertaintyB,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
