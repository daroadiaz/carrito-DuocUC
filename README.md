## Docker y Despliegue

### Construcción Inicial

```bash
# Construir todas las imágenes
docker-compose up --build

# Construir sin iniciar
docker-compose build
```

### Gestión de Contenedores

```bash
# Iniciar servicios
docker-compose up

# Iniciar en background
docker-compose up -d

# Detener contenedores
docker-compose stop

# Detener y eliminar
docker-compose down
```

### Logs y Monitoreo

```bash
# Ver logs
docker-compose logs

# Logs en tiempo real
docker-compose logs -f

# Ver logs de errores
docker-compose logs | grep ERROR
```

### Manejo de Modificaciones

```bash
# Detener contenedores
docker-compose down

# Reconstruir imágenes
docker-compose build

# Reconstruir e iniciar
docker-compose up --build

# Reconstruir servicio específico
docker-compose build frontend
docker-compose build backend
```

### Gestión de Servicios Individuales

```bash
# Iniciar frontend
docker-compose up frontend

# Iniciar backend
docker-compose up backend

# Reiniciar servicios
docker-compose restart frontend
docker-compose restart backend
```

### Limpieza del Sistema

```bash
# Eliminar contenedores, redes y volúmenes
docker-compose down -v

# Limpiar imágenes no utilizadas
docker system prune -a

# Limpiar volúmenes
docker volume prune
```

### Inspección y Diagnóstico

```bash
# Estado de contenedores
docker-compose ps

# Uso de recursos
docker stats

# Ver redes
docker network ls
```

### Acceso a Contenedores

```bash
# Acceder al backend
docker-compose exec backend sh

# Acceder al frontend
docker-compose exec frontend sh
```

## URLs del Proyecto

- Frontend: http://localhost:8080
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Workflow de Desarrollo

1. Iniciar entorno:
```bash
docker-compose up -d
```

2. Realizar cambios en el código

3. Reconstruir servicio modificado:
```bash
docker-compose build [servicio]
```

4. Reiniciar servicio:
```bash
docker-compose up -d --no-deps [servicio]
```

## Troubleshooting

### Problemas Comunes

1. Contenedores no inician:
```bash
docker-compose logs
```

2. Problemas de permisos:
```bash
sudo chown -R $USER:$USER .
```

3. Puertos en uso:
```bash
netstat -tulpn | grep LISTEN
```

4. Reconstrucción completa:
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Notas Importantes

- Usar `docker-compose down` antes de reconstruir con cambios significativos
- Monitorear logs durante desarrollo con `docker-compose logs -f`
- Usar `--build` para cambios en Dockerfiles o dependencias
- Mantener el sistema limpio con `docker system prune` periódicamente

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Crea un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.
