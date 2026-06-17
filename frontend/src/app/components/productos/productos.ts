import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductosService } from '../../services/productos';
import { CategoriasService } from '../../services/categorias';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-productos',
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
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './productos.html',
  styleUrl: './productos.scss'
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  categorias: any[] = [];
  productoForm: FormGroup;
  editando = false;
  productoEditId: number | null = null;
  mostrarFormulario = false;
  busqueda = '';
  displayedColumns = ['nombre', 'categoria', 'precio', 'stock', 'acciones'];

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: ['', Validators.required],
      stock: ['', Validators.required],
      categoria_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos(): void {
    this.productosService.getProductos().subscribe({
      next: (res) => this.productos = res,
      error: (err) => console.error(err)
    });
  }

  cargarCategorias(): void {
    this.categoriasService.getCategorias().subscribe({
      next: (res) => this.categorias = res,
      error: (err) => console.error(err)
    });
  }

  guardar(): void {
    if (this.productoForm.invalid) return;
    if (this.editando && this.productoEditId) {
      this.productosService.updateProducto(this.productoEditId, this.productoForm.value).subscribe({
        next: () => {
          this.snackBar.open('Producto actualizado', 'Cerrar', { duration: 3000 });
          this.cargarProductos();
          this.cancelar();
        }
      });
    } else {
      this.productosService.createProducto(this.productoForm.value).subscribe({
        next: () => {
          this.snackBar.open('Producto creado', 'Cerrar', { duration: 3000 });
          this.cargarProductos();
          this.cancelar();
        }
      });
    }
  }

  editar(producto: any): void {
    this.editando = true;
    this.productoEditId = producto.id;
    this.mostrarFormulario = true;
    this.productoForm.patchValue(producto);
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar producto?')) {
      this.productosService.deleteProducto(id).subscribe({
        next: () => {
          this.snackBar.open('Producto eliminado', 'Cerrar', { duration: 3000 });
          this.cargarProductos();
        }
      });
    }
  }

  buscar(): void {
    if (this.busqueda.trim()) {
      this.productosService.searchProductos(this.busqueda).subscribe({
        next: (res) => this.productos = res
      });
    } else {
      this.cargarProductos();
    }
  }

  cancelar(): void {
    this.editando = false;
    this.productoEditId = null;
    this.mostrarFormulario = false;
    this.productoForm.reset();
  }
}
