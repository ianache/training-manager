import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DuplicateIdValidator implements AsyncValidator {
  constructor(private http: HttpClient) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(300),
      switchMap(id => this.checkDuplicate(id)),
      map(isDuplicate => isDuplicate ? { duplicateId: true } : null),
      catchError(() => of(null))
    );
  }

  private checkDuplicate(id: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`/api/v1/parties/check-id/${id}`).pipe(
      map(response => response.exists),
      catchError(() => of(false))
    );
  }
}
