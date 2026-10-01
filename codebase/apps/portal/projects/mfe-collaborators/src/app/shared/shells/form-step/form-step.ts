import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GfButton } from '@gf/ui';

@Component({
  selector: 'app-shell-form-step',
  standalone: true,
  imports: [CommonModule, GfButton],
  template: `
    <div class="form-stepper">
      <div class="step-indicator">Step {{ currentStep() + 1 }} of {{ steps().length }}</div>
      <div *ngFor="let step of steps(); let i = index" [hidden]="i !== currentStep()" class="step-content">
        <h2>{{ step.title }}</h2>
        <ng-content></ng-content>
      </div>
      <div class="step-actions">
        <gf-button
          *ngIf="currentStep() > 0"
          label="Atrás"
          (click)="previousStep.emit()"
        ></gf-button>
        <gf-button
          *ngIf="currentStep() < steps().length - 1"
          label="Siguiente"
          [disabled]="!isStepValid()"
          (click)="nextStep.emit()"
        ></gf-button>
        <gf-button
          *ngIf="currentStep() === steps().length - 1"
          label="Guardar"
          [disabled]="!isStepValid()"
          (click)="submit.emit()"
        ></gf-button>
      </div>
    </div>
  `,
  styles: [`
    .form-stepper {
      padding: var(--gf-space-4);
    }
    .step-indicator {
      font-size: 0.875rem;
      color: var(--gf-color-text-secondary);
      margin-bottom: var(--gf-space-4);
    }
    .step-content {
      padding: var(--gf-space-4);
      border: 1px solid var(--gf-color-border);
      border-radius: var(--gf-radius-md);
      margin-bottom: var(--gf-space-4);
    }
    .step-actions {
      display: flex;
      gap: var(--gf-space-2);
      justify-content: flex-end;
      margin-top: var(--gf-space-4);
    }
  `]
})
export class ShellFormStep {
  readonly steps = input<Array<{label: string, title: string}>>([]);
  readonly currentStep = input(0);
  readonly isStepValid = input(false);
  readonly isSubmitting = input(false);

  readonly nextStep = output<void>();
  readonly previousStep = output<void>();
  readonly submit = output<void>();
}
