# Proyecto YOLO con Microservicios en Raspberry Pi

## Descripción

Proyecto que utiliza arquitectura de microservicios con Flask, Docker, y MySQL para procesar videos con YOLO (detección de objetos), guardar datos y mostrarlos en un dashboard web con Grafana.

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
3. Accede a:
   - Frontend: `http://<ip_raspberry>:3001`
   - Grafana: `http://<ip_raspberry>:3000`

## Variables de configuración

Por ahora están en `docker-compose.yml`, puedes modificar los puertos y contraseñas en ese archivo.

## Próximos pasos

- Integrar detección YOLO en `yolo-service`.
- Conectar detecciones con `data`.
- Mejorar frontend con visualizaciones interactivas.

