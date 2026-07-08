import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Categoria } from '../../core/models/categoria.model';
import { Receita, ReceitaRequest } from '../../core/models/receita.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { mesAtual } from '../../shared/date.util';
import { MesAnoPickerComponent } from '../../shared/mes-ano-picker/mes-ano-picker.component';

export interface ReceitaFormDialogData {
  receita?: Receita;
}

@Component({
  selector: 'app-receita-form-dialog',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MesAnoPickerComponent,
  ],
  templateUrl: './receita-form-dialog.component.html',
})
export class ReceitaFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ReceitaFormDialogComponent>);
  private readonly categoriaService = inject(CategoriaService);
  private readonly data = inject<ReceitaFormDialogData>(MAT_DIALOG_DATA);

  readonly editando = !!this.data.receita;
  categorias: Categoria[] = [];

  readonly form = this.fb.nonNullable.group({
    categoriaId: [this.data.receita?.categoriaId ?? null, Validators.required],
    descricao: [this.data.receita?.descricao ?? '', [Validators.required, Validators.maxLength(255)]],
    valor: [this.data.receita?.valor ?? null, [Validators.required, Validators.min(0.01)]],
    mesReferencia: [this.data.receita?.mesReferencia ?? mesAtual(), Validators.required],
  });

  ngOnInit(): void {
    this.categoriaService.listar('RECEITA').subscribe((categorias) => (this.categorias = categorias));
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const request = this.form.getRawValue() as ReceitaRequest;
    this.dialogRef.close(request);
  }
}
