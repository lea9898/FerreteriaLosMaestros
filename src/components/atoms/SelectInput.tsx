interface SelectInputProps {
  id: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder: string;
  invalid?: boolean;
  disabled?: boolean;
  describedBy?: string;
}

export function SelectInput({
  id, value, options, onChange, onBlur, placeholder, invalid = false, disabled = false, describedBy,
}: SelectInputProps) {
  return (
    <select
      id={id}
      className={`form-select${invalid ? ' is-invalid' : ''}`}
      value={value}
      disabled={disabled}
      aria-invalid={invalid}
      aria-describedby={describedBy}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}
