import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { forkJoin } from 'rxjs';
import { Cartao } from '../../core/models/cartao.model';
import { Categoria } from '../../core/models/categoria.model';
import { CompraRequest } from '../../core/models/compra.model';
import { CartaoService } from '../../core/services/cartao.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { toIsoDate } from '../../shared/date.util';

@Component({
  selector: 'app-compra-form-dialog',
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
  templateUrl: './compra-form-dialog.component.html',
})
export class CompraFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CompraFormDialogComponent>);
  private readonly cartaoService = inject(CartaoService);
  private readonly categoriaService = inject(CategoriaService);

  cartoes: Cartao[] = [];
  categorias: Categoria[] = [];

  readonly form = this.fb.nonNullable.group({
    cartaoId: [null as unknown as number, Validators.required],
    categoriaId: [null as unknown as number, Validators.required],
    descricao: ['', [Validators.required, Validators.maxLength(255)]],
    valorTotal: [null as unknown as number, [Validators.required, Validators.min(0.01)]],
    dataCompra: [toIsoDate(new Date()), Validators.required],
    numeroParcelas: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    forkJoin({
      cartoes: this.cartaoService.listar(),
      categorias: this.categoriaService.listar('DESPESA'),
    }).subscribe(({ cartoes, categorias }) => {
      this.cartoes = cartoes;
      this.categorias = categorias;
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const request: CompraRequest = this.form.getRawValue();
    this.dialogRef.close(request);
  }
}
