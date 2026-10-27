interface TextInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: 'text' | 'number' | 'search';
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  describedBy?: string;
}

export function TextInput({
  id, value, onChange, onBlur, type = 'text', placeholder, invalid = false, disabled = false, describedBy,
}: TextInputProps) {
  return (
    <input
      id={id}
      type={type}
      className={`form-control${invalid ? ' is-invalid' : ''}`}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      min={type === 'number' ? 0 : undefined}
      aria-invalid={invalid}
      aria-describedby={describedBy}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  );
}
