import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GastoCompartilhado, GastoCompartilhadoRequest } from '../../core/models/gasto-compartilhado.model';
import { mesAtual, toIsoDate } from '../../shared/date.util';
import { MesAnoPickerComponent } from '../../shared/mes-ano-picker/mes-ano-picker.component';

export interface GastoCompartilhadoFormDialogData {
  gasto?: GastoCompartilhado;
}

@Component({
  selector: 'app-gasto-compartilhado-form-dialog',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MesAnoPickerComponent,
  ],
  templateUrl: './gasto-compartilhado-form-dialog.component.html',
})
export class GastoCompartilhadoFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<GastoCompartilhadoFormDialogComponent>);
  private readonly data = inject<GastoCompartilhadoFormDialogData>(MAT_DIALOG_DATA);

  readonly editando = !!this.data.gasto;

  readonly form = this.fb.nonNullable.group({
    descricao: [this.data.gasto?.descricao ?? '', [Validators.required, Validators.maxLength(255)]],
    valor: [this.data.gasto?.valor ?? (null as unknown as number), [Validators.required, Validators.min(0.01)]],
    data: [this.data.gasto?.data ?? toIsoDate(new Date()), Validators.required],
    direcao: [this.data.gasto?.direcao ?? ('EU_PARA_ELA' as const), Validators.required],
    mesReferencia: [this.data.gasto?.mesReferencia ?? mesAtual(), Validators.required],
  });

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const request: GastoCompartilhadoRequest = this.form.getRawValue();
    this.dialogRef.close(request);
  }
}
