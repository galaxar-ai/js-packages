# @galaxar/create-app

Helper tool to init a genx application [https://github.com/genx-tech/gx-create-app](https://github.com/genx-tech/gx-create-app)

![GitHub last commit](https://img.shields.io/github/last-commit/genx-tech/gx-create-app)

## Usage

```
npm init @genx/app <app dir name> [options]
```
or
```
npm install -g @genx/create-app
genx-init <app dir name> [options]
```

## Options

```
Options:
  -s, --silent
    Silent mode
    default: false

  -v, --version
    Show version information
    default: false

  -l, --list-modes
    Show a list of available app modes
    default: false

  -h, --help
    Show usage message
    default: false

  -m, --mode
    Target application mode
    required
    available values:
        "server": Web service hosting project based on @genx/server
        "app-module": App module to be hosted by @genx/server
        "app-feature": App feature to be used by @genx/app

  -n, --name, --app-name
    Application name
    required

  -c, --conf, --config
    Config path

  --lock, --package-lock, --with-package-lock
    With npm package lock
    required

  --skip-install, --skip-npm-install
    Skip dependencies installation
    required

  --public
    To publish publicly in npm
```

## Samples

Create a public app feature project.
```
mkdir example
genx-init MyAppFeature --name=example-app --mode=app-feature --public
```

Create a private services hosting project.
```
genx-init MyWebServer --name=my-web-server --mode=server 
npm run dev
//visit http://localhost:3000 to see the default page
```

Create an app module under the hosting project directory created by the above sample.
```
genx-init module-dir --name=my-module --mode=app-module 
npm run dev
//visit http://localhost:3000/hello to see the default page
```

Create a mobile app.
```
genx-init MyAppDir --name=MyApp --mode=mobile 
npm run ios
//or npm run android
```
   
## License

  MIT    