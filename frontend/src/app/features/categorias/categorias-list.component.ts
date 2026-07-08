import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Categoria } from '../../core/models/categoria.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { mensagemErro } from '../../shared/http-error.util';
import { NotificationService } from '../../shared/notification.service';
import { CategoriaFormDialogComponent } from './categoria-form-dialog.component';

@Component({
  selector: 'app-categorias-list',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './categorias-list.component.html',
})
export class CategoriasListComponent implements OnInit {
  private readonly categoriaService = inject(CategoriaService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  categorias: Categoria[] = [];
  carregando = false;
  readonly displayedColumns = ['nome', 'tipo', 'acoes'];

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.categoriaService.listar().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.carregando = false;
      },
      error: () => {
        this.notification.erro('Não foi possível carregar as categorias.');
        this.carregando = false;
      },
    });
  }

  novo(): void {
    const ref = this.dialog.open(CategoriaFormDialogComponent, { data: {} });
    ref.afterClosed().subscribe((request) => {
      if (!request) {
        return;
      }
      this.categoriaService.criar(request).subscribe({
        next: () => {
          this.notification.sucesso('Categoria criada com sucesso.');
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível criar a categoria.')),
      });
    });
  }

  editar(categoria: Categoria): void {
    const ref = this.dialog.open(CategoriaFormDialogComponent, { data: { categoria } });
    ref.afterClosed().subscribe((request) => {
      if (!request) {
        return;
      }
      this.categoriaService.atualizar(categoria.id, request).subscribe({
        next: () => {
          this.notification.sucesso('Categoria atualizada com sucesso.');
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível atualizar a categoria.')),
      });
    });
  }

  excluir(categoria: Categoria): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Excluir categoria',
        mensagem: `Deseja excluir a categoria "${categoria.nome}"?`,
      },
    });
    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) {
        return;
      }
      this.categoriaService.deletar(categoria.id).subscribe({
        next: () => {
          this.notification.sucesso('Categoria excluída com sucesso.');
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível excluir a categoria.')),
      });
    });
  }
}
