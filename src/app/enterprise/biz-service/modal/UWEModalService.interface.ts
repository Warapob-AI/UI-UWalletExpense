export interface UWEModal {
  type: 'success' | 'error' | 'warning' | 'info' | 'question';
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}