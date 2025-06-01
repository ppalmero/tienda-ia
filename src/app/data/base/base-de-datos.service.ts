import { Injectable } from '@angular/core';
import { VentaVoz } from '../../modelo/venta-voz';
import { collection, deleteDoc, setDoc, doc, getDocs, getFirestore, QuerySnapshot, query, where } from 'firebase/firestore/lite';
import { initializeApp } from "firebase/app";
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Compra } from '../../modelo/compra';
import { Producto } from '../../modelo/producto';
import { Venta } from '../../modelo/venta';
import { Colecciones } from '../../modelo/colecciones';

@Injectable({
  providedIn: 'root'
})
export class BaseDeDatosService {

  private resultadoBDSubject$ = new Subject<void>();
  resultadoBD$ = this.resultadoBDSubject$.asObservable();
  private resultadoBD!: void;

  private datosBDSubject$ = new Subject<QuerySnapshot>();
  datosBD$ = this.datosBDSubject$.asObservable();
  private datosBD!: QuerySnapshot;

  private datosXIDBDSubject$ = new Subject<QuerySnapshot>();
  datosXID$ = this.datosXIDBDSubject$.asObservable();
  private datosXID!: QuerySnapshot;

  private datosBDCategoriaSubject$ = new Subject<QuerySnapshot>();
  datosBDCategoria$ = this.datosBDCategoriaSubject$.asObservable();

  private datosBDProductosSubject$ = new Subject<QuerySnapshot>();
  datosBDProductos$ = this.datosBDProductosSubject$.asObservable();

  private datosBDProductosIASubject$ = new Subject<QuerySnapshot>();
  datosBDProductosIA$ = this.datosBDProductosIASubject$.asObservable();

  private datosBDPromocionesSubject$ = new Subject<QuerySnapshot>();
  datosBDPromociones$ = this.datosBDPromocionesSubject$.asObservable();

  ventaVoz: VentaVoz = { productoVentaVoz: "", precioVentaVoz: 0, cantidadVentaVoz: 0, textoVentaVoz: "" };

  basededatos: any;

  constructor() {
    const app = initializeApp(environment.firebase);
    this.basededatos = getFirestore(app);
  }

  async guardarCompra(compra: Compra) {
    try {
      const fechaDate: Date = new Date();
      //const fechaNombreDoc: string = compra.fechaCompra.getFullYear() + "" + (compra.fechaCompra.getMonth() + 1) + (compra.fechaCompra.getDate() + 1) + fechaDate.getHours() + fechaDate.getMinutes() + fechaDate.getSeconds();
      const docRef = await setDoc(doc(this.basededatos, "compras", "compras" + compra.fechaCompra), compra);
      console.log(docRef);
    } catch (error) {
      console.error("Error al enviar el documento: ", error);

    }
  }

  async guardarVentaVoz(voz: VentaVoz) {
    try {
      voz.fechaVentaVoz = new Date().getTime();
      const docRef = await setDoc(doc(this.basededatos, 'ventaVoz', 'ventaVoz' + voz.productoVentaVoz), voz); // Nombre de la colección
      console.log(docRef);
      this.resultadoBD = docRef;
      this.resultadoBDSubject$.next(this.resultadoBD);
      //alert('Tus datos se enviaron con éxito.');
      //const cityRef = doc(this.basededatos, 'cities', 'LA');
      //setDoc(cityRef, { capital: true }, { merge: true });
      /*await setDoc(doc(this.basededatos, "cities", "LA"), {
        name: "El Volcán",
        state: "SL",
        country: "AR"
      });*/

      /*UPDATE
      const washingtonRef = doc(db, "cities", "DC");

      // Atomically increment the population of the city by 50.
      await updateDoc(washingtonRef, {
          population: increment(50)
      });
      */
    } catch (error) {
      console.error("Error al enviar el documento: ", error);

    }
  }

  async guardarProducto(producto: Producto){
    try {
      const docRef = await setDoc(doc(this.basededatos, 'productos', 'producto' + producto.nombreProducto), producto); // Nombre de la colección
      this.resultadoBD = docRef;
      this.resultadoBDSubject$.next(this.resultadoBD);
    } catch (error) {
      console.error('Error al subir la imagen: ', error);
    }
  }

  async obtenerDatos(tabla: string) {
    const docRef = collection(this.basededatos, tabla);
    this.datosBD = await getDocs(docRef);
    switch (tabla) {
      case Colecciones.CATEGORIAS: this.datosBDCategoriaSubject$.next(this.datosBD); break;
      case Colecciones.PRODUCTOS: this.datosBDProductosSubject$.next(this.datosBD); break;
      case Colecciones.PROMOCIONES: this.datosBDPromocionesSubject$.next(this.datosBD); break;
      case Colecciones.PRODUCTOSIA: this.datosBDProductosIASubject$.next(this.datosBD); break;
      default: this.datosBDSubject$.next(this.datosBD);
    }
  }
  
  async obtenerDatosXID(tabla: string, id: number) {
    const q = query(collection(this.basededatos, tabla), where("idProducto", "==", id));
    this.datosXID = await getDocs(q);
    this.datosXIDBDSubject$.next(this.datosXID);
  }

  async guardarVenta(venta: Venta) {
    try {
      const docRef = await setDoc(doc(this.basededatos, 'ventas', 'venta' + venta.fechaVenta), venta); // Nombre de la colección
      console.log(docRef);
      this.resultadoBD = docRef;
      this.resultadoBDSubject$.next(this.resultadoBD);
    } catch (error) {
      console.error("Error al enviar el documento: ", error);
    }
  }

  async eliminarDocumento(coleccion: string, documento: string){
    try {
      const docRef = await deleteDoc(doc(this.basededatos, coleccion, documento));
    } catch (error) {
      console.error("Error al enviar el documento: ", error);
    }
  }
}
