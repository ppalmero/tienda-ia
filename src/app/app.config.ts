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
    // Inicialización de Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    // Proveer Firestore (y otros servicios de Firebase que uses)
    provideFirestore(() => getFirestore()),
    // provideAuth(() => getAuth()), // Si usas Autenticación
    // provideStorage(() => getStorage()) // Si usas Cloud Storage
  ]
};
