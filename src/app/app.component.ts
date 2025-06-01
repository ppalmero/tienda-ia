import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CargaJsonFirebaseService } from './servicios/carga-json-firebase.service';
import { NgIf, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BaseDeDatosService } from './data/base/base-de-datos.service';
import { Subscription } from 'rxjs';
import { Producto } from './modelo/producto';

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

  subscriptionProductoAccion!: Subscription;
  productos: Producto[] = [];


  constructor(private bd: BaseDeDatosService,) {
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



  cargarProductos(): void {
    this.bd.obtenerDatos("productosIA");
    this.subscriptionProductoAccion = this.bd.datosBDProductosIA$.subscribe((voz) => {
      //console.log("Productos: " + voz);
      if (voz) {
        voz.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          //let v: string = doc.data()['valor'];
          let v: Producto = doc.data() as Producto;
          this.productos.push(v);
        });
      }
      this.subscriptionProductoAccion.unsubscribe();
    });
  }
}