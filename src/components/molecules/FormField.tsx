import { SelectInput } from '../atoms/SelectInput';
import { TextInput } from '../atoms/TextInput';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  type?: 'text' | 'number';
  options?: string[];
  placeholder?: string;
  disabled?: boolean;
}

/** Molécula: etiqueta + campo (átomo) + mensaje de error. */
export function FormField({
  id, label, value, onChange, onBlur, error, type = 'text', options, placeholder, disabled,
}: FormFieldProps) {
  const errorId = `${id}-error`;
  const common = {
    id, value, onChange, onBlur, disabled,
    invalid: Boolean(error),
    describedBy: error ? errorId : undefined,
  };
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">{label}</label>
      {options ? (
        <SelectInput {...common} options={options} placeholder={placeholder ?? 'Selecciona una opción'} />
      ) : (
        <TextInput {...common} type={type} placeholder={placeholder} />
      )}
      {error && <div id={errorId} className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
