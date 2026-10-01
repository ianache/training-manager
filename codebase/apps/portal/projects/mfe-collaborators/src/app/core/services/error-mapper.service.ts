import { Injectable } from '@angular/core';

export interface AppError {
  code: string;
  message: string;
  details?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorMapperService {
  mapError(error: any): AppError {
    // E1: Permission denied
    if (error.status === 403 || error.error?.code === 'E1') {
      return { code: 'E1', message: 'No tienes permisos para registrar colaboradores' };
    }

    // E5: Duplicate ID
    if (error.error?.code === 'E5') {
      return {
        code: 'E5',
        message: `DNI ${error.error?.details} ya está registrado`,
        details: error.error?.details
      };
    }

    // E6: Duplicate email
    if (error.error?.code === 'E6') {
      return {
        code: 'E6',
        message: `Correo ${error.error?.details} ya está en uso`,
        details: error.error?.details
      };
    }

    // E10: Validation error
    if (error.error?.code === 'E10') {
      return { code: 'E10', message: 'Error de validación', details: error.error?.details };
    }

    // Default error
    return { code: 'E0', message: 'Error desconocido', details: error.message };
  }
}
