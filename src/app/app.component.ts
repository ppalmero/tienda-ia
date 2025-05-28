import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CargaJsonFirebaseService } from './servicios/carga-json-firebase.service';
import { NgIf, NgFor } from '@angular/common';
import { forkJoin, Observable, switchMap } from 'rxjs';
import { Producto } from './modelo/producto';
import { HttpClient } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import { environment } from './environments/environment';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

@Component({
  selector: 'app-root',
  imports: [NgIf, NgFor,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Carga de Productos a Firebase';
  productosCargados: any[] = [];
  cargando = false;
  mensaje = '';
  error = '';

  basededatos: any;

  constructor(private http: HttpClient, private productoService: CargaJsonFirebaseService) {
    /*const app = initializeApp(environment.firebase);
    this.basededatos = getFirestore(app);
    this.cargarProductosDesdeJsonAFirebase();*/
    //console.log("algo");
  }

  ngOnInit(): void {
    // Puedes llamar a la función de carga automáticamente al iniciar el componente
    // o a través de un botón en el HTML.
    // this.cargarProductos();
    //this.obtenerProductosDeFirebase(); // Para mostrar los productos ya cargados
  }

  getProductosFromJson(): Observable<Producto[]> {
    return this.http.get<Producto[]>('assets/productos.jsonl');
  }

  cargarProductosDesdeJsonAFirebase(): Observable<any[]> {
    return this.getProductosFromJson().pipe(
      switchMap(productos => {
        const operacionesGuardado: Promise<any>[] = [];
        productos.forEach(producto => {
          operacionesGuardado.push(this.guardarProductoEnFirebase(producto));
        });
        return forkJoin(operacionesGuardado); // Espera a que todas las promesas se resuelvan
      })
    );
  }

  async guardarProductoEnFirebase(producto: Producto): Promise<any> {
    // Si el producto ya tiene un 'id', lo usamos para actualizar, sino, Firebase generará uno nuevo.
    if (producto.id) {
      return this.basededatos.collection('productosIA').doc(producto.id).set(producto);
    } else {
      // Usar add() para que Firebase genere un ID automáticamente.
      // Puedes obtener el ID del documento una vez que la promesa se resuelva si lo necesitas.
      //return this.basededatos.collection('productosIA').add(producto);
      const docRef = await addDoc(collection(this.basededatos, "productosIA"), producto);//JSON.parse(JSON.stringify(this.comunicacion.usuario)));
    }
  }

  cargarProductos(): void {
    this.cargando = true;
    this.mensaje = 'Cargando productos desde JSON a Firebase...';
    this.error = '';

    this.cargarProductosDesdeJsonAFirebase().subscribe({
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