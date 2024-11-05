# PAC 2

## Prerequisits
- Instal·lar i executar [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Instal·lar [Node.js 18](https://nodejs.org/en/download/package-manager/current)
- Instal·lar [Angular](https://angular.dev/tools/cli/setup-local)

## backend
En la carpeta *backend* hi ha els fitxers necessaris per a executar la base de dades i el *backend* en contenidors *Docker*.
```
cd backend
./start.sh
```

## frontend
En la carpeta *frontend* hi ha els fitxers necessaris per a executar el frontend des d'un terminal o bé depurar el codi amb [VS Code](https://code.visualstudio.com/).
```
cd frontend
npm install
ng serve
```
