import styles from './ChipGroup.module.scss';

interface ChipGroupProps<T extends string> {
  legend: string;
  name: string;
  type: 'radio' | 'checkbox'; // radio = single choice, checkbox = multiple choice
  options: Record<T, string>; // value -> label
  isSelected: (value: T) => boolean;
  onToggle: (value: T) => void;
}

// Selection as "chips". Real radio/checkbox inputs under the hood so keyboard and screen readers work.
export function ChipGroup<T extends string>({
  legend,
  name,
  type,
  options,
  isSelected,
  onToggle,
}: ChipGroupProps<T>) {
  return (
    <fieldset>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.chips}>
        {(Object.entries(options) as [T, string][]).map(([value, label]) => (
          <label key={value} className={styles.chip}>
            <input
              type={type}
              name={name}
              value={value}
              checked={isSelected(value)}
              onChange={() => onToggle(value)}
              className={styles.input}
            />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
