import { Component, input, output, CommonModule } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { GfButton } from '@gf/ui';

@Component({
  selector: 'app-shell-form-step',
  standalone: true,
  imports: [CommonModule, MatStepperModule, GfButton],
  template: `
    <mat-stepper [selectedIndex]="currentStep()" linear>
      <mat-step *ngFor="let step of steps(); let i = index" [completed]="i < currentStep()">
        <ng-template matStepLabel>{{ step.label }}</ng-template>
        <div class="step-content">
          <h2>{{ step.title }}</h2>
          <ng-content></ng-content>
        </div>
        <div class="step-actions">
          <gf-button
            *ngIf="i > 0"
            label="Atrás"
            (click)="previousStep.emit()"
          ></gf-button>
          <gf-button
            *ngIf="i < steps().length - 1"
            label="Siguiente"
            [disabled]="!isStepValid()"
            (click)="nextStep.emit()"
          ></gf-button>
          <gf-button
            *ngIf="i === steps().length - 1"
            label="Guardar"
            [isLoading]="isSubmitting()"
            (click)="submit.emit()"
          ></gf-button>
        </div>
      </mat-step>
    </mat-stepper>
  `,
  styles: [`
    .step-content {
      padding: var(--gf-space-4);
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
