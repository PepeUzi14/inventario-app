import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriasService } from '../../services/categorias';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-categorias',
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
    MatSnackBarModule
  ],
  templateUrl: './categorias.html',
  styleUrl: './categorias.scss'
})
export class CategoriasComponent implements OnInit {
  categorias: any[] = [];
  categoriaForm: FormGroup;
  editando = false;
  categoriaEditId: number | null = null;
  mostrarFormulario = false;
  displayedColumns = ['nombre', 'acciones'];

  constructor(
    private categoriasService: CategoriasService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriasService.getCategorias().subscribe({
      next: (res) => this.categorias = res,
      error: (err) => console.error(err)
    });
  }

  guardar(): void {
    if (this.categoriaForm.invalid) return;
    if (this.editando && this.categoriaEditId) {
      this.categoriasService.updateCategoria(this.categoriaEditId, this.categoriaForm.value).subscribe({
        next: () => {
          this.snackBar.open('Categoría actualizada', 'Cerrar', { duration: 3000 });
          this.cargarCategorias();
          this.cancelar();
        }
      });
    } else {
      this.categoriasService.createCategoria(this.categoriaForm.value).subscribe({
        next: () => {
          this.snackBar.open('Categoría creada', 'Cerrar', { duration: 3000 });
          this.cargarCategorias();
          this.cancelar();
        }
      });
    }
  }

  editar(categoria: any): void {
    this.editando = true;
    this.categoriaEditId = categoria.id;
    this.mostrarFormulario = true;
    this.categoriaForm.patchValue(categoria);
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar categoría?')) {
      this.categoriasService.deleteCategoria(id).subscribe({
        next: () => {
          this.snackBar.open('Categoría eliminada', 'Cerrar', { duration: 3000 });
          this.cargarCategorias();
        }
      });
    }
  }

  cancelar(): void {
    this.editando = false;
    this.categoriaEditId = null;
    this.mostrarFormulario = false;
    this.categoriaForm.reset();
  }
}
