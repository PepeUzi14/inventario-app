import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovimientosService } from '../../services/movimientos';
import { ProductosService } from '../../services/productos';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './movimientos.html',
  styleUrl: './movimientos.scss'
})
export class MovimientosComponent implements OnInit {
  movimientos: any[] = [];
  productos: any[] = [];
  movimientoForm: FormGroup;
  mostrarFormulario = false;
  tipoMovimiento = 'entrada';
  displayedColumns = ['producto', 'tipo', 'cantidad', 'fecha'];

  constructor(
    private movimientosService: MovimientosService,
    private productosService: ProductosService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.movimientoForm = this.fb.group({
      producto_id: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.cargarMovimientos();
    this.cargarProductos();
  }

  cargarMovimientos(): void {
    this.movimientosService.getMovimientos().subscribe({
      next: (res) => this.movimientos = res,
      error: (err) => console.error(err)
    });
  }

  cargarProductos(): void {
    this.productosService.getProductos().subscribe({
      next: (res) => this.productos = res,
      error: (err) => console.error(err)
    });
  }

  guardar(): void {
    if (this.movimientoForm.invalid) return;
    const data = this.movimientoForm.value;
    if (this.tipoMovimiento === 'entrada') {
      this.movimientosService.entradaStock(data).subscribe({
        next: () => {
          this.snackBar.open('Entrada registrada', 'Cerrar', { duration: 3000 });
          this.cargarMovimientos();
          this.cancelar();
        },
        error: (err) => this.snackBar.open(err.error.error, 'Cerrar', { duration: 3000 })
      });
    } else {
      this.movimientosService.salidaStock(data).subscribe({
        next: () => {
          this.snackBar.open('Salida registrada', 'Cerrar', { duration: 3000 });
          this.cargarMovimientos();
          this.cancelar();
        },
        error: (err) => this.snackBar.open(err.error.error, 'Cerrar', { duration: 3000 })
      });
    }
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.movimientoForm.reset();
  }
}
