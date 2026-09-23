# ☁️ SmartShop Cloud  
## Aplicación Serverless en AWS

Proyecto académico orientado a la implementación de una arquitectura **serverless utilizando servicios administrados de Amazon Web Services (AWS)**.

La solución permite publicar una aplicación web estática, procesar solicitudes mediante funciones Lambda, almacenar información en DynamoDB y monitorear las ejecuciones mediante CloudWatch Logs.

Este repositorio es principalmente descriptivo y demostrativo, ya que los servicios se encuentran en AWS Academy, sin embargo se crea una maqueta demostrando la misma funcionalidad del proyecto original.
---

# 📌 Descripción del proyecto

SmartShop Cloud implementa una tienda tecnológica simple donde un usuario puede:

- Acceder mediante autenticación básica.
- Visualizar productos.
- Generar pedidos.
- Registrar información de pedidos.
- Consultar evidencia de ejecución mediante logs.

La aplicación fue construida utilizando una arquitectura sin servidores tradicionales, aprovechando servicios administrados de AWS.

---

# 🏗️ Arquitectura Serverless

![Arquitectura AWS](img/arquitectura.png)

La solución está compuesta por los siguientes servicios:

| Servicio AWS | Función dentro del proyecto |
|---|---|
| Amazon S3 | Hosting del sitio web estático |
| API Gateway | Entrada HTTP para consumir las funciones |
| AWS Lambda | Ejecución de la lógica de negocio |
| DynamoDB | Persistencia de usuarios y pedidos |
| CloudWatch Logs | Monitoreo y registro de ejecuciones |

---

# 🔄 Flujo de funcionamiento

```
Usuario
   |
   ↓
Amazon S3
   |
   ↓
API Gateway
   |
   ├───────────────┐
   ↓               ↓
usuarios_lambda   pedidos_lambda
   ↓               ↓
DynamoDB          DynamoDB
Usuarios          Pedidos


Lambda
   ↓
CloudWatch Logs
```

---

# 🪣 Amazon S3 - Hosting estático

El frontend de la aplicación fue desplegado utilizando un bucket S3 configurado con Static Website Hosting.

![S3 Static Hosting](img/s3-static-hosting.png)

Responsabilidades:

- Alojar el archivo `index.html`.
- Servir la interfaz web al usuario.
- Permitir el consumo de la API mediante solicitudes HTTP.

---

# 🌐 API Gateway

API Gateway funciona como punto de entrada entre la aplicación web y las funciones Lambda.

![API Gateway](img/api-gateway.png)

Rutas configuradas:

| Método | Ruta | Lambda asociada |
|---|---|---|
| POST | `/usuarios` | usuarios_lambda |
| POST | `/pedidos` | pedidos_lambda |

Ejemplo de flujo:

```
POST /usuarios

        ↓

API Gateway

        ↓

usuarios_lambda
```

---

# ⚡ AWS Lambda

Las funciones Lambda contienen la lógica principal de la aplicación.

## usuarios_lambda

Función encargada de validar los datos de acceso del usuario.

Flujo:

```
Solicitud de login

        ↓

usuarios_lambda

        ↓

Consulta DynamoDB Usuarios

        ↓

Respuesta al usuario
```

![Lambda Usuarios](img/lambda-usuarios.png)


---

## pedidos_lambda

Función encargada de recibir pedidos y almacenarlos en DynamoDB.

Flujo:

```
Solicitud de pedido

        ↓

pedidos_lambda

        ↓

Guardar información

        ↓

DynamoDB Pedidos
```

![Lambda Pedidos](img/lambda-pedidos.png)

---

# 🗄️ Amazon DynamoDB

La persistencia del sistema se implementó utilizando DynamoDB.

## Tabla Usuarios

Almacena la información de usuarios utilizados para la autenticación.

Ejemplo:

```json
{
  "usuarioId": "1",
  "usuario": "juanGatito",
  "nombre": "Juan Perez",
  "password": "1234"
}
```

![DynamoDB Usuarios](img/dynamodb-usuarios.png)


---

## Tabla Pedidos

Almacena los pedidos generados por los usuarios.

Clave primaria:

```
orderId
```

Ejemplo:

```json
{
  "orderId": "ORD-001",
  "usuarioId": "1",
  "usuario": "Juan Perez",
  "productos": [
    {
      "producto": "Notebook Gamer",
      "cantidad": 1
    }
  ],
  "total": 699990
}
```

![DynamoDB Pedidos](img/dynamodb-pedidos.png)

---

# 📊 Amazon CloudWatch Logs

CloudWatch fue utilizado como herramienta de monitoreo para verificar las ejecuciones de las funciones Lambda.

![CloudWatch Logs](img/cloudwatch-logs.png)

Permite revisar:

- Ejecuciones realizadas.
- Solicitudes recibidas.
- Mensajes generados por Lambda.
- Errores durante la ejecución.

CloudWatch funciona como una capa independiente de monitoreo:

```
usuarios_lambda ─────┐
                     ↓
              CloudWatch Logs
                     ↑
pedidos_lambda ──────┘
```

---

# 🧪 Pruebas realizadas

Se realizaron pruebas de funcionamiento mediante:

- Navegador web.
- Postman.
- Consola AWS.

Ejemplo de autenticación:

```json
POST /usuarios

{
    "usuario": "juanGatito",
    "password": "1234"
}
```

Respuesta:

```json
{
    "mensaje": "Login correcto"
}
```

![Pruebas API](img/pruebas-api.png)

---

# 🖥️ Aplicación Web

La interfaz permite:

- Inicio de sesión.
- Selección de productos.
- Creación de pedidos.
- Visualización de pedidos generados.

![Aplicación Web](img/aplicacion-web.png)

---

# 📂 Estructura del proyecto

```
SmartShop-Cloud

│
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
├── lambda/
│   ├── usuarios_lambda/
│   └── pedidos_lambda/
│
├── img/
│   ├── arquitectura.png
│   ├── s3-static-hosting.png
│   ├── api-gateway.png
│   ├── lambda-usuarios.png
│   ├── lambda-pedidos.png
│   ├── dynamodb-usuarios.png
│   ├── dynamodb-pedidos.png
│   ├── cloudwatch-logs.png
│   └── aplicacion-web.png
│
└── README.md
```

---

# 🚀 Resultados obtenidos

Se logró implementar una aplicación funcional utilizando una arquitectura serverless donde:

✅ El frontend fue alojado en Amazon S3.  
✅ API Gateway permitió exponer endpoints HTTP.  
✅ Lambda ejecutó la lógica de negocio.  
✅ DynamoDB almacenó información sin servidores administrados.  
✅ CloudWatch permitió monitorear las ejecuciones.

---

