import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const dynamodb = new DynamoDBClient({});

export const handler = async (event) => {

    console.log("Evento recibido:", JSON.stringify(event));

    let datos = event;

    // Si viene desde API Gateway
    if (event.body) {
        try {
            datos = JSON.parse(event.body);
        } catch (error) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    mensaje: "JSON inválido"
                })
            };
        }
    }

    const usuario = datos.usuario;
    const password = datos.password;

    // Comprobar que llegaron los datos
    if (!usuario || !password) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                mensaje: "Debe ingresar usuario y contraseña"
            })
        };
    }

    try {

        // Buscar el usuario en DynamoDB
        const comando = new ScanCommand({
            TableName: "Usuarios",

            FilterExpression: "#usuario = :usuario",

            ExpressionAttributeNames: {
                "#usuario": "usuario"
            },

            ExpressionAttributeValues: {
                ":usuario": {
                    S: String(usuario)
                }
            }
        });

        const resultado = await dynamodb.send(comando);

        const item = resultado.Items?.[0];

        // Usuario no encontrado
        if (!item) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    mensaje: "Usuario o contraseña incorrectos"
                })
            };
        }

        // Contraseña incorrecta
        if (item.password?.S !== String(password)) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    mensaje: "Usuario o contraseña incorrectos"
                })
            };
        }

        // Login correcto
        return {
            statusCode: 200,
            body: JSON.stringify({
                mensaje: "Login correcto",
                usuario: {
                    usuarioId: item.usuarioId.S,
                    usuario: item.usuario.S,
                    nombre: item.nombre.S,
                    email: item.email.S
                }
            })
        };

    } catch (error) {

        console.error("Error DynamoDB:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                mensaje: "Error al consultar usuarios"
            })
        };
    }
};