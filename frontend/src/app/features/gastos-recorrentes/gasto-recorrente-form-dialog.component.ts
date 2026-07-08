import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Categoria } from '../../core/models/categoria.model';
import { GastoRecorrenteRequest } from '../../core/models/gasto-recorrente.model';
import { CategoriaService } from '../../core/services/categoria.service';

@Component({
  selector: 'app-gasto-recorrente-form-dialog',
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
  ],
  templateUrl: './gasto-recorrente-form-dialog.component.html',
})
export class GastoRecorrenteFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<GastoRecorrenteFormDialogComponent>);
  private readonly categoriaService = inject(CategoriaService);

  categorias: Categoria[] = [];

  readonly form = this.fb.nonNullable.group({
    categoriaId: [null as unknown as number, Validators.required],
    nome: ['', [Validators.required, Validators.maxLength(100)]],
  });

  ngOnInit(): void {
    this.categoriaService.listar('DESPESA').subscribe((categorias) => (this.categorias = categorias));
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const request: GastoRecorrenteRequest = this.form.getRawValue();
    this.dialogRef.close(request);
  }
}
