import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {
  private apiUrl = 'http://localhost:3000/api/movimientos';

  constructor(private http: HttpClient) {}

  getMovimientos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  entradaStock(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/entrada`, data);
  }

  salidaStock(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/salida`, data);
  }
}
