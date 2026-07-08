import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { proximoMes } from '../date.util';
import { MesAnoPickerComponent } from '../mes-ano-picker/mes-ano-picker.component';

export interface DuplicarDialogData {
  titulo: string;
  mesReferenciaOrigem: string;
}

export interface DuplicarDialogResultado {
  mesInicial: string;
  quantidadeMeses: number;
}

@Component({
  selector: 'app-duplicar-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MesAnoPickerComponent,
  ],
  templateUrl: './duplicar-dialog.component.html',
})
export class DuplicarDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<DuplicarDialogComponent>);
  readonly data = inject<DuplicarDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    mesInicial: [proximoMes(this.data.mesReferenciaOrigem), Validators.required],
    quantidadeMeses: [1, [Validators.required, Validators.min(1), Validators.max(24)]],
  });

  confirmar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const resultado: DuplicarDialogResultado = this.form.getRawValue();
    this.dialogRef.close(resultado);
  }
}
