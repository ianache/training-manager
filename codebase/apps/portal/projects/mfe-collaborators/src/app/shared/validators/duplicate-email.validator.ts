import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, map, catchError, timeout } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DuplicateEmailValidator implements AsyncValidator {
  constructor(private http: HttpClient) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(300),
      timeout(5000),
      switchMap(email => this.checkDuplicate(email)),
      map(isDuplicate => isDuplicate ? { duplicateEmail: true } : null),
      catchError(() => of(null))
    );
  }

  private checkDuplicate(email: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`/api/v1/parties/check-email/${email}`).pipe(
      map(response => response.exists),
      catchError(() => of(false))
    );
  }
}
