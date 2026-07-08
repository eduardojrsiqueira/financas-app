import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Categoria, CategoriaRequest } from '../../core/models/categoria.model';

export interface CategoriaFormDialogData {
  categoria?: Categoria;
}

@Component({
  selector: 'app-categoria-form-dialog',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './categoria-form-dialog.component.html',
})
export class CategoriaFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CategoriaFormDialogComponent>);
  private readonly data = inject<CategoriaFormDialogData>(MAT_DIALOG_DATA);

  readonly editando = !!this.data.categoria;

  readonly form = this.fb.nonNullable.group({
    nome: [this.data.categoria?.nome ?? '', [Validators.required, Validators.maxLength(100)]],
    tipo: [this.data.categoria?.tipo ?? ('DESPESA' as const), Validators.required],
  });

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const request: CategoriaRequest = this.form.getRawValue();
    this.dialogRef.close(request);
  }
}
