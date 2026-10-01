import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Observable, of, debounceTime, switchMap, tap, catchError } from 'rxjs';
import { GfLabel, GfTextInput, GfSpinner } from '../../atoms';

@Component({
  selector: 'gf-autocomplete',
  standalone: true,
  imports: [CommonModule, GfLabel, GfTextInput, GfSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gf-label [inputId]="inputId" [text]="label()" [required]="required()"></gf-label>
    <gf-text-input
      [attr.id]="inputId"
      [value]="searchText()"
      [attr.role]="'combobox'"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-autocomplete]="'list'"
      (valueChange)="onSearch($event)"
      (blur)="onBlur()"
    ></gf-text-input>
    <gf-spinner *ngIf="isLoading()" size="small"></gf-spinner>
    <ul *ngIf="isOpen()" role="listbox" class="options">
      <li *ngFor="let opt of (filteredOptions$ | async)" role="option" (click)="select(opt)">
        {{ opt.label }}
      </li>
    </ul>
  `,
  styles: [`
    .options {
      list-style: none;
      margin: var(--gf-space-1) 0;
      padding: 0;
      border: 1px solid var(--gf-color-border);
      border-radius: var(--gf-radius-sm);
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    li {
      padding: var(--gf-space-2) var(--gf-space-3);
      cursor: pointer;
    }
    li:hover {
      background: var(--gf-color-bg-hover);
    }
  `]
})
export class GfAutocomplete {
  readonly label = input('');
  readonly required = input(false);
  readonly searchFn = input.required<(q: string) => Observable<any[]>>();

  readonly selected = output<any>();

  searchText = signal('');
  isOpen = signal(false);
  isLoading = signal(false);
  filteredOptions$: Observable<any[]> = of([]);
  inputId = `autocomplete-${Math.random().toString(36).substr(2, 9)}`;

  onSearch(query: string) {
    this.searchText.set(query);
    this.isOpen.set(query.length > 0);

    if (query.length === 0) {
      this.filteredOptions$ = of([]);
      return;
    }

    this.isLoading.set(true);
    this.filteredOptions$ = of(query).pipe(
      debounceTime(300),
      switchMap(q => this.searchFn()(q)),
      tap(() => this.isLoading.set(false)),
      catchError(() => {
        this.isLoading.set(false);
        return of([]);
      })
    );
  }

  select(option: any) {
    this.selected.emit(option);
    this.isOpen.set(false);
    this.searchText.set(option.label);
  }

  onBlur() {
    setTimeout(() => this.isOpen.set(false), 100);
  }
}
