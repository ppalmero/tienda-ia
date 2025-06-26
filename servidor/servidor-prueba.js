// readFirestore.js

// 1. Importar el SDK de Firebase Admin
import admin from 'firebase-admin';
// 2. Importar tus credenciales de la cuenta de servicio
// Asegúrate de que la ruta a tu archivo JSON sea correcta
// Si lo guardaste en la raíz del proyecto, solo necesitas el nombre del archivo.
import { createRequire } from 'module';

import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs/promises'; // Importa el módulo 'fs/promises' para trabajar con archivos de forma asíncrona
import path from 'path'; // Importa el módulo 'path' para construir rutas de archivos
import { fileURLToPath } from 'url'; // Importa fileURLToPath

const app = express();
const port = process.env.SERVER_PORT || 8000;

import { genkit } from 'genkit';
import { googleAI, gemini20Flash } from '@genkit-ai/googleai';

const __filename = fileURLToPath(import.meta.url); // Obtiene la ruta del archivo actual
const __dirname = path.dirname(__filename); // Obtiene la ruta del directorio del archivo actual

const conversaciones = {};
//const promptInicialAsistente = "¡Hola! Soy tu guía virtual en San Luis. ¿Qué te gustaría saber o hacer hoy por aquí?";
let promptInicialAsistente; // Variable para almacenar el prompt inicial

async function cargarPromptInicial() {
  try {
    //const filePath = path.join(__dirname, 'prompt_licencias.txt'); // Construye la ruta al archivo
    //promptInicialAsistente = await fs.readFile(filePath, 'utf-8'); // Lee el contenido del archivo
    //const docRef = db.collection('productosIA');
    //const doc = await docRef.get();

    //console.log(doc/*, promptInicialAsistente*/);

    promptInicialAsistente = readCollection('productosIA');

    console.log("***PROMPT INICIAL***");
    console.log(promptInicialAsistente);
  } catch (error) {
    console.error('Error al cargar el prompt inicial:', error);
    promptInicialAsistente = "¡Hola! ¿En qué puedo ayudarte hoy?"; // Mensaje por defecto en caso de error
  }
}


app.use(bodyParser.json());

// Add Access Control Allow Origin headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});





const require = createRequire(import.meta.url);

const serviceAccount = require('./angular-4e797-firebase-adminsdk-apwjh-11804e4509.json');

// 3. Inicializar la aplicación Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// 4. Obtener una referencia a la base de datos Firestore
const db = admin.firestore();


// Cargar el prompt inicial al iniciar el servidor
cargarPromptInicial();

// --- FUNCIONES PARA LEER DATOS ---

// Función para leer todos los documentos de una colección
async function readCollection(collectionName) {
  try {
    const snapshot = await db.collection(collectionName).get();
    if (snapshot.empty) {
      console.log(`No documents found in collection '${collectionName}'.`);
      return [];
    }

    const documents = [];
    snapshot.forEach(doc => {
      //console.log(`ID: ${doc.id} => Data:`, doc.data());
      documents.push({ id: doc.id, ...doc.data() });
    });
    //return documents;
    const jsonString = JSON.stringify(documents, null, 2); // 'null, 2' para un formato JSON legible con indentación
    promptInicialAsistente = jsonString;
    return jsonString;
  } catch (error) {
    console.error(`Error reading collection '${collectionName}':`, error);
    return [];
  }
}

// Función para leer un documento específico por su ID
async function readDocument(collectionName, documentId) {
  try {
    const docRef = db.collection(collectionName).doc(documentId);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.log(`Document '${documentId}' not found in collection '${collectionName}'.`);
      return null;
    } else {
      console.log(`Document '${documentId}' => Data:`, doc.data());
      return { id: doc.id, ...doc.data() };
    }
  } catch (error) {
    console.error(`Error reading document '${documentId}' from collection '${collectionName}':`, error);
    return null;
  }
}

// Función para realizar consultas filtradas (ejemplo: donde el precio es mayor que 100)
async function queryCollection(collectionName, field, operator, value) {
  try {
    const snapshot = await db.collection(collectionName).where(field, operator, value).get();
    if (snapshot.empty) {
      console.log(`No documents matching the query in collection '${collectionName}'.`);
      return [];
    }

    const documents = [];
    snapshot.forEach(doc => {
      console.log(`Query Result ID: ${doc.id} => Data:`, doc.data());
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (error) {
    console.error(`Error querying collection '${collectionName}':`, error);
    return [];
  }
}

// --- EJEMPLOS DE USO ---
async function main() {
  console.log('\n--- Reading all documents from "productos" collection ---');
  await readCollection('productosIA');

  /*console.log('\n--- Reading a specific document from "productos" collection (ID: 1) ---');
  await readDocument('productos', '1'); // Asumiendo que tienes un producto con ID '1'*/

  console.log('\n--- Querying documents in "productos" where "precio" > 100 ---');
  await queryCollection('productosIA', 'precio', '>', 50);

  /*console.log('\n--- Querying documents in "productos" where "categoria" == "Electrónica" ---');
  await queryCollection('productos', 'categoria', '==', 'Electrónica');

  console.log('\n--- Reading a collection that might not exist ---');
  await readCollection('nonExistentCollection');*/
}

// Ejecutar la función principal
//main();


app.post("/api/conversacion/:userId", async (req, res, next) => {
  const ai = genkit({
    plugins: [googleAI({ apiKey: "k" })],
    model: gemini20Flash,
  });

  const userId = req.params.userId;
  const nuevaPregunta = req.body.pregunta;

  if (!userId || !nuevaPregunta) {
    return res.status(400).json({ error: 'El ID de usuario y la pregunta son obligatorios.' });
  }

  if (!conversaciones[userId]) {
    conversaciones[userId] = [{ rol: 'Vendedor', contenido: "Eres un vendedor que solamente puedes contestar sobre estos productos que te anexo, que es un json de productos que vendes en una tienda." *
      "Cada producto dentro del json está compuesto por ID, categoría, descripción, imagen, link, marca, nombre y precio, exclusivamente debes contestar sobre estos atributos, no ofrezcas de otras tiendas: " + promptInicialAsistente }];
    /*conversaciones[userId] = [{
      rol: 'Asistente',
      contenido: [
        { "text": "Eres un asistente de ventas especializado en los siguientes productos. Debes responder a las preguntas del usuario basándote EXCLUSIVAMENTE en la información de esta lista. Si una pregunta se refiere a un producto no listado o a información no disponible en la lista, debes indicar que no tienes información sobre ese producto o característica." },
        { "text": "Lista de productos disponibles (en formato JSON):\n" },
        { "text": "```json\n" + promptInicialAsistente + "\n```\n" }, // <-- Aquí insertas tu JSON
        { "text": "Por favor, dime qué laptops tienes disponibles." }
      ]
    }];*/
  }

  console.log(conversaciones[userId]);
  const historial = conversaciones[userId];
  historial.push({ rol: 'Usuario', contenido: nuevaPregunta });

  const contextoHistorial = historial.map(msg => `${msg.rol}: ${msg.contenido}`).join('\n');
  const prompt = `${contextoHistorial}\Vendedor:`;

  try {
    const { text } = await ai.generate(prompt);
    const respuesta = { rol: 'Vendedor', contenido: text };
    historial.push(respuesta);
    res.json({ respuesta: respuesta.contenido });
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));