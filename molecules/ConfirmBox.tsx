import { Button } from '../atoms/Button';

interface ConfirmBoxProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmBox({ message, onConfirm, onCancel }: ConfirmBoxProps) {
  return (
    <div className="alert alert-warning border-0 shadow-sm d-flex flex-wrap align-items-center gap-2" role="alertdialog">
      <span className="me-auto">{message}</span>
      <Button variant="danger" size="sm" onClick={onConfirm}>Confirmar eliminación</Button>
      <Button variant="outline-secondary" size="sm" onClick={onCancel}>Cancelar</Button>
    </div>
  );
}
