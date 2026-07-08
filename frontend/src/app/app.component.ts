import { NgForOf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';

interface ItemMenu {
  rota: string;
  label: string;
  icone: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgForOf,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver);

  isHandset = false;

  readonly isHandset$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  readonly menu: ItemMenu[] = [
    { rota: '/dashboard', label: 'Dashboard', icone: 'dashboard' },
    { rota: '/cartoes', label: 'Cartões', icone: 'credit_card' },
    { rota: '/categorias', label: 'Categorias', icone: 'sell' },
    { rota: '/compras', label: 'Compras', icone: 'shopping_cart' },
    { rota: '/gastos-recorrentes', label: 'Gastos Recorrentes', icone: 'autorenew' },
    { rota: '/receitas', label: 'Receitas', icone: 'payments' },
    { rota: '/gastos-compartilhados', label: 'Gastos Compartilhados', icone: 'people' },
  ];

  ngOnInit(): void {
    this.isHandset$.subscribe((valor) => (this.isHandset = valor));
  }
}
