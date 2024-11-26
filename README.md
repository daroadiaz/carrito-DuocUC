# CarritoDuocUC

Este proyecto fue creado utilizando Angular CLI versión 19.0.2.

## Servidor de desarrollo

Para iniciar el servidor local, ejecuta:

```bash
ng serve
```

Luego, abre tu navegador y ve a http://localhost:4200/. Los cambios que realices en los archivos del proyecto se reflejarán automáticamente.

## Crear componentes u otros elementos

Para generar un nuevo componente, ejecuta:

```bash
ng generate component component-name
```

Para más opciones y esquemas disponibles (como directivas o pipes), ejecuta:

```bash
ng generate --help
```

## Building

Compilar el proyecto:

```bash
ng build
```

Los archivos compilados se guardarán en la carpeta dist/. La compilación para producción optimiza el rendimiento.

## Ejecutar pruebas unitarias

Para correr las pruebas unitarias:

```bash
ng test
```

## Documentación del proyecto

Para generar la documentación del proyecto, primero instala Compodoc:

```bash
npm install --save-dev @compodoc/compodoc
```

Luego, genera la documentación con:

```bash
npx compodoc -p tsconfig.json
```

Esto generará una carpeta documentation/ con todos los archivos necesarios para visualizar la documentación del proyecto. Para ver la documentación en tu navegador, inicia el servidor de Compodoc con:

```bash
npx compodoc -s
```
Accede a la documentación en http://localhost:8080/.
