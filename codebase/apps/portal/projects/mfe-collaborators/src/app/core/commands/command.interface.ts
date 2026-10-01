import { Observable } from 'rxjs';

export interface Command<TPayload = any, TResult = any> {
  payload?: TPayload;
  execute(): Observable<TResult>;
}

export interface CommandResult {
  codigo: string;
  mensaje: string;
}
