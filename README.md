# Implementacion de YOLO dentro de la universidad 

## Descripción

Proyecto que utiliza arquitectura de microservicios con Flask, Docker, y MySQL para procesar el flujo de personas y trasporte con YOLO (detección de objetos), guardar datos y mostrarlos en un dashboard web con Grafana.

## Arquitectura

- **api-gateway:** Punto de entrada para peticiones.
- **auth-service:** Autenticación con JWT.
- **user-service:** Gestión básica de usuarios.
- **yolo-service:** Procesa videos y detecta objetos.
- **data:** Guarda resultados en MySQL.
- **frontend:** Interfaz web para visualización.
- **grafana:** Dashboard de métricas y análisis.
- **mysql:** Base de datos.

## Requisitos

- Raspberry Pi con Docker y Docker Compose instalados.
- Cámara (Implementar).
- Video de entrada (por ahora desde carpeta).

## Cómo correr el proyecto

1. Clona el repositorio.
2. Ejecuta:
    ```bash
    docker-compose up -d --build
    ```
3. Continua...

## Variables de configuración

Por ahora están en `docker-compose.yml`,  modificar los puertos y contraseñas*

## Próximos pasos

- Integrar detección YOLO en `yolo-service`.
- Conectar detecciones con `data`.
- Mejorar frontend con visualizaciones interactivas.

