import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CargaJsonFirebaseService } from './servicios/carga-json-firebase.service';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [NgIf, NgFor, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Carga de Productos a Firebase';
  productosCargados: any[] = [];
  cargando = false;
  mensaje = '';
  error = '';

  constructor(private productoService: CargaJsonFirebaseService) { }

  ngOnInit(): void {
    // Puedes llamar a la función de carga automáticamente al iniciar el componente
    // o a través de un botón en el HTML.
    // this.cargarProductos();
    this.obtenerProductosDeFirebase(); // Para mostrar los productos ya cargados
  }

  cargarProductos(): void {
    this.cargando = true;
    this.mensaje = 'Cargando productos desde JSON a Firebase...';
    this.error = '';

    this.productoService.cargarProductosDesdeJsonAFirebase().subscribe({
      next: (resultados) => {
        console.log('Productos cargados exitosamente:', resultados);
        this.mensaje = `Se han cargado ${resultados.length} productos a Firebase.`;
        this.cargando = false;
        this.obtenerProductosDeFirebase(); // Actualizar la lista después de la carga
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'Ocurrió un error al cargar los productos. Revisa la consola para más detalles.';
        this.cargando = false;
      },
      complete: () => {
        console.log('Proceso de carga de productos completado.');
      }
    });
  }

  obtenerProductosDeFirebase(): void {
    /*this.productoService.getProductosDeFirebase().subscribe({
      next: (productos) => {
        this.productosCargados = productos;
        console.log('Productos en Firebase:', this.productosCargados);
      },
      error: (err) => {
        console.error('Error al obtener productos de Firebase:', err);
        this.error = 'Error al obtener productos de Firebase.';
      }
    });*/
  }
}