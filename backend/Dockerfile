FROM python:3.10-slim

# Instalar make y limpiar caché
RUN apt-get update && \
    apt-get install -y make && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar Makefile y requirements primero
COPY Makefile .
COPY requirements.txt .

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto
EXPOSE 8000

# Ejecutar setup y run usando los comandos Linux del Makefile
CMD make setup-linux && make run-linux