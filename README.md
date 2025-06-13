# Wrapper Frontend Fyxtoken

<p align="center">
  <img src="https://fyxtokentech.github.io/frontend-fyxtoken/img/metadata/logo-main.svg" alt="Fyxtoken Logo" width="200" />
</p>

<p align="center">
 <img src="https://img.shields.io/badge/License-Private-red" alt="LICENSE"/> <img src="https://img.shields.io/badge/NestJS-11.0.1-e0234e" alt="NestJS"/> <img src="https://img.shields.io/badge/Node.js-%3E%3D16-brightgreen" alt="Node.js"/>
</p>

## Descripción

Servicio backend en NestJS que:
- Sirve la aplicación React compilada desde la carpeta `public`.
- Proporciona el endpoint **POST /api/app/get-front/sudo/{secretKey}** que sincroniza la última build del frontend remoto.
- Expone documentación Swagger UI en **/docs**.
- Soporta CORS, validación global y manejo de peticiones grandes (límite 50MB).
- Pendiente: implementación de socket.io para websockets en el cliente.

## 🔗 Previsualizaciones

- Swagger Docs: http://localhost:3000/docs  

## 📦 Instalación y ejecución

```bash
# Clonar repo
git clone https://github.com/Jeff-Aporta/wraper-front-fyxtoken.git

cd wraper-front-fyxtoken

# instala dependencias y descarga la build del frontend (Ejecutar una vez)
npm run deploy-build

# Inicia el servidor en producción (Ejecutar cada vez que se quiera iniciar el servidor)
npm run deploy-start
```  

## 🎯 Endpoints REST

| Método | Ruta                   | Descripción                               |
|--------|------------------------|-------------------------------------------|
| POST   | /api/app/get-front/sudo/{secretKey}     | Actualiza la carpeta `public` con la última build del frontend |

---

<h1>Con Wrapper</h1>
<br/>
<img src="static/con-wrapper.svg" alt="Con Wrapper" width="100%" />
<h1>Sin Wrapper</h1>
<br/>
<img src="static/sin-wrapper.svg" alt="Sin Wrapper" width="100%"  />