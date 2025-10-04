# Caso de rueba


**Diagrama de arquitectura:** <br>
Diagrama de arquitectura planteado para el caso de prueba <br>
<img width="35%" height="35%" alt="image" src="https://github.com/user-attachments/assets/bdea0839-a0dd-4679-822a-16185713dea2" />
<br>

**Diagrama de base dedatos:** Diagrama de base datos utilizado en la prueba. <br>
<img width="527" height="347" alt="image" src="https://github.com/user-attachments/assets/414e3de3-2dca-4558-8df6-6fca426fe846" />
<br>

**Ejecución del proyecto:** A continuación se describe el paso a paso para la ejecución del proyecto. <br>

**Ejecuta los microservicios (en terminales separadas):**<br>
Para ejecutar el micro servicio para la gestión de usaurios: <br>
```bash
cd backend/user-service
npx nodemon index.js
```
Para Task Service: <br>
Para ejecutar el micro servicio para la gestión de tareas:
```bash
cd backend/task-service 
nodemon index.js
```
**Ejecuta el frontend:**<br> 
Para ejecutar el micro servicio que presenta el frontend:
```bash
cd frontend
npm run dev
```
Acceder a la URL: http://localhost:5173 en el navegador. <br> 
Inicia sesión con los siguientes datos:<br>
**id:** 1<br>
**password:** clase123<br>

Navega entre Usuarios y Tareas usando los enlaces. Usa logout para cerrar sesión.<br>
