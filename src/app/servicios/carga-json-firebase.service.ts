import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';
import { getFirestore } from 'firebase/firestore';

interface Producto {
  id?: string; // Firebase generará un ID si no lo proporcionas
  nombre: string;
  marca: string;
  precio: number;
  descripcion: string;
  categoria: string;
  imagen: string;
  link: string;
}

@Injectable({
  providedIn: 'root'
})
export class CargaJsonFirebaseService {

  basededatos: any;
  constructor(
    private http: HttpClient,
    /*private firestore: AngularFirestore*/
  ) { 
    const app = initializeApp(environment.firebase);
        this.basededatos = getFirestore(app);
  }

  /**
   * Lee el archivo JSON de productos desde la carpeta assets.
   */
  getProductosFromJson(): Observable<Producto[]> {
    return this.http.get<Producto[]>('assets/clientes.json');
  }

  /**
   * Guarda un producto individual en la colección 'productos' de Firestore.
   * @param producto El objeto producto a guardar.
   */
  guardarProductoEnFirebase(producto: Producto): Promise<any> {
    // Si el producto ya tiene un 'id', lo usamos para actualizar, sino, Firebase generará uno nuevo.
    if (producto.id) {
      return this.basededatos.collection('productos').doc(producto.id).set(producto);
    } else {
      // Usar add() para que Firebase genere un ID automáticamente.
      // Puedes obtener el ID del documento una vez que la promesa se resuelva si lo necesitas.
      return this.basededatos.collection('productos').add(producto);
    }
  }

  /**
   * Carga todos los productos del JSON a Firebase uno por uno.
   * Retorna un Observable que emite los resultados de cada operación de guardado.
   */
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

  /**
   * Obtiene todos los productos de Firebase. (Opcional, para verificar la carga)
   */
  /*getProductosDeFirebase(): Observable<Producto[]> {
    return this.firestore.collection<Producto>('productos').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Producto;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }*/
}
/*export class CargaJsonFirebaseService {

  constructor() { }
}*/
