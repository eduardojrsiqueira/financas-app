import { NgFor } from '@angular/common';
import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NOMES_MESES } from '../date.util';

@Component({
  selector: 'app-mes-ano-picker',
  standalone: true,
  imports: [NgFor, FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './mes-ano-picker.component.html',
  styleUrls: ['./mes-ano-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MesAnoPickerComponent),
      multi: true,
    },
  ],
})
export class MesAnoPickerComponent implements ControlValueAccessor {
  readonly meses = NOMES_MESES.map((nome, indice) => ({ valor: indice + 1, nome }));
  readonly anos: number[];

  mes = new Date().getMonth() + 1;
  ano = new Date().getFullYear();
  disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    const anoAtual = new Date().getFullYear();
    this.anos = Array.from({ length: 13 }, (_, indice) => anoAtual - 2 + indice);
  }

  writeValue(value: string | null): void {
    if (value) {
      const [ano, mes] = value.split('-').map(Number);
      this.ano = ano;
      this.mes = mes;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  emitir(): void {
    const mesFormatado = String(this.mes).padStart(2, '0');
    this.onChange(`${this.ano}-${mesFormatado}`);
    this.onTouched();
  }
}
