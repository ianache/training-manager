import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Command, CommandResult } from './command.interface';

export interface RegisterCollaboratorPayload {
  tipo: 'empleado' | 'contratista';
  nombres: string;
  apellidos: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  correoLaboral: string;
  unidadId?: string;
  jefeDirectoId?: string;
  proveedorId?: string;
  rolId: string;
  nivelId: string;
  fechaDesde: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterCollaboratorCommand implements Command<RegisterCollaboratorPayload, CommandResult> {
  payload?: RegisterCollaboratorPayload;

  constructor(private http: HttpClient) {}

  execute(): Observable<CommandResult> {
    if (!this.payload) {
      throw new Error('Payload is required');
    }
    return this.http.post<CommandResult>('/api/v1/parties', this.payload, {
      headers: {
        'X-User-Name': 'current-user',
        'X-Request-ID': this.generateRequestId()
      }
    });
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
