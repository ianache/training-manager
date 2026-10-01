import { Injectable } from '@angular/core';
import { RegisterCollaboratorCommand, RegisterCollaboratorPayload } from '../commands/register-collaborator.command';
import { ErrorMapperService } from './error-mapper.service';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterCollaboratorService {
  constructor(
    private command: RegisterCollaboratorCommand,
    private errorMapper: ErrorMapperService
  ) {}

  register(payload: RegisterCollaboratorPayload): Observable<any> {
    this.command.payload = payload;
    return this.command.execute().pipe(
      catchError(error => {
        const appError = this.errorMapper.mapError(error);
        return throwError(() => appError);
      })
    );
  }
}
