import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shell-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen()" (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="close.emit()">✕</button>
        <h2>{{ title() }}</h2>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-content {
      background: white;
      border-radius: var(--gf-radius-lg);
      padding: var(--gf-space-4);
      max-width: 600px;
      position: relative;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }
    .close-btn {
      position: absolute;
      top: var(--gf-space-2);
      right: var(--gf-space-2);
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }
  `]
})
export class ShellModal {
  readonly isOpen = input(false);
  readonly title = input('');

  readonly close = output<void>();
}
