interface DataSliderProps {
  title: string;
  value: number;
  setter: (n: number) => void;
  min?: number;
  max?: number;
}

export const DataSlider = ({ data }: { data: DataSliderProps }) => {
  const { title, value, setter, min = 0, max = 100 } = data;

  return (
    <div className="flex flex-col gap-2 my-6">
      <p>{title}</p>
      <input
        type="range"
        value={value}
        onChange={(e) => setter(Number(e.target.value))}
        min={min}
        max={max}
      />
    </div>
  );
};
