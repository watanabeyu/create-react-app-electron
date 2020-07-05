# Electron with create-react-app
You can run Electron with create-react-app by this repository.  
By the way, this repository also supports development / production delivery

## run
```bash
# develop
$ npm run dev / prod

# package
$ npm run package:development / package:production
```

## config file
* Embed environments -> `config/config.development.json` / `config/config.production.json`
* Electron build settings -> `config/electron-builder.development.yml` / `config/electron-builder.production.yml`