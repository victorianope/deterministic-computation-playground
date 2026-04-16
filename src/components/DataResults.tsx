export interface DataResultsProps {
  mean: number;
  error: number;
  samples: number;
}

export const DataResults = ({
  data,
}: {
  data: DataResultsProps;
}) => {
  return (
    <div className="flex flex-col gap-2 my-6">
      <p>Mean value: {Number(data.mean.toFixed(5))}</p>
      <p>Relative error: {data.error}%</p>
      <p>Iterations needed: {data.samples === 1 ? "No sampling required" : data.samples}</p>
    </div>
  );
};
