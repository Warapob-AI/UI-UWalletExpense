import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { UWEModal } from './UWEModalService.interface';

@Injectable({ providedIn: 'root' })
export class UWEModalService {
  show(modal: UWEModal): void {
    Swal.fire({
      icon: modal.type,
      title: modal.title,
      text: modal.message,
      confirmButtonText: modal.confirmButtonText ?? 'Confirm',
      showCancelButton: modal.showCancelButton ?? (modal.type === 'question'),
      cancelButtonText: modal.cancelButtonText ?? 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        modal.onConfirm?.();
      } else {
        modal.onCancel?.();
      }
    });
  }
}