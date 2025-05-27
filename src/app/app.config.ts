import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(), 
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay()), 
    /*provideFirebaseApp(() => initializeApp({ projectId: "angular-4e797", 
      appId: "1:845735969236:web:98d133ea8776217d271641", 
      databaseURL: "https://angular-4e797-default-rtdb.firebaseio.com", 
      storageBucket: "angular-4e797.firebasestorage.app", 
      apiKey: "AIzaSyBsyAl4KhKka8IfVmGHfsTrLdRKzvdhDTU", 
      authDomain: "angular-4e797.firebaseapp.com", 
      messagingSenderId: "845735969236" })), 
    provideFirestore(() => getFirestore())*/
    // Inicialización de Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    // Proveer Firestore (y otros servicios de Firebase que uses)
    provideFirestore(() => getFirestore()),
    // provideAuth(() => getAuth()), // Si usas Autenticación
    // provideStorage(() => getStorage()) // Si usas Cloud Storage
  ]
};

/***
 * In Angular 17 - NullInjectorError: No provider for _HttpClient! Go to your app.config.ts Inside the providers array add:

provideHttpClient()

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(),
  ],
};

 */