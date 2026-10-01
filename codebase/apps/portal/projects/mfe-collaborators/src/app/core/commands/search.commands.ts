import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Command, CommandResult } from './command.interface';

export interface SearchResult {
  id: string;
  label: string;
}

@Injectable({ providedIn: 'root' })
export class SearchUnitsCommand implements Command<string, SearchResult[]> {
  payload?: string;
  constructor(private http: HttpClient) {}
  execute(): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(`/api/v1/units?q=${this.payload}`);
  }
}

@Injectable({ providedIn: 'root' })
export class SearchRolesCommand implements Command<string, SearchResult[]> {
  payload?: string;
  constructor(private http: HttpClient) {}
  execute(): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(`/api/v1/roles?q=${this.payload}`);
  }
}

@Injectable({ providedIn: 'root' })
export class SearchProvidersCommand implements Command<string, SearchResult[]> {
  payload?: string;
  constructor(private http: HttpClient) {}
  execute(): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(`/api/v1/providers?q=${this.payload}`);
  }
}

@Injectable({ providedIn: 'root' })
export class SearchManagersCommand implements Command<string, SearchResult[]> {
  payload?: string;
  constructor(private http: HttpClient) {}
  execute(): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(`/api/v1/managers?q=${this.payload}`);
  }
}
