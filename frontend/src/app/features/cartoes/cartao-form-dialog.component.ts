import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Cartao, CartaoRequest } from '../../core/models/cartao.model';

export interface CartaoFormDialogData {
  cartao?: Cartao;
}

@Component({
  selector: 'app-cartao-form-dialog',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './cartao-form-dialog.component.html',
})
export class CartaoFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CartaoFormDialogComponent>);
  private readonly data = inject<CartaoFormDialogData>(MAT_DIALOG_DATA);

  readonly editando = !!this.data.cartao;

  readonly form = this.fb.nonNullable.group({
    nome: [this.data.cartao?.nome ?? '', [Validators.required, Validators.maxLength(100)]],
    bandeira: [this.data.cartao?.bandeira ?? ''],
    diaFechamento: [
      this.data.cartao?.diaFechamento ?? 1,
      [Validators.required, Validators.min(1), Validators.max(31)],
    ],
    diaVencimento: [
      this.data.cartao?.diaVencimento ?? 10,
      [Validators.required, Validators.min(1), Validators.max(31)],
    ],
  });

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const request: CartaoRequest = this.form.getRawValue();
    this.dialogRef.close(request);
  }
}
