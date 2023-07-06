# @galaxar/server

Galaxar node.js web server application framework based on @galaxar/app

## Server
A galaxar server is a @galaxar/app with serveral extensions as below.

-	engines
	-	koa (built-in)

-	serverFeatures
	-	features which is only applicable to server

-	appFeatures
	-	features which is applicable to both server and app modules

-	appRouting (one of serverFeatures)
	-	support mounting a whole app module to a route
	-	support mounting app modules in node_modules

-	routing (one of appFeatures)
	-	provide serveral kinds of built-in routers
	-	custom routers can be put under the server (or app)'s routers folder

-	middlewares (one of appFeatures)
	-	use an async middleware factory pattern to initiate middleware instance
	-	support all koa-style middlewares, most of express-style middlewares
	-	support group several middlewares together to become a new middleware by the `middlewareFactory`` feature

## App module
-	A galaxar app module is also a @galaxar/app hosted by a galaxar server. 
-	A app module can be mounted under a specified route in a galaxar server through the `appRouting` feature.

## Project structure

-	`<server root>`
	-	conf			`server.default.json`
	-	server			transpiled files from `src`
	-	src
		-	actions		rule/module router controllers
		-	features	features/services
		-	middlewares	middleware factories
		-	resources	gaml/rest router controllers
		-	index.js	entry file of the server
	-	apps			app modules
		-	conf		`app.default.json`
		-	server		transpiled files from `src`
		-	src			similar to the server source folder except the index.js file
	-	node_modules	packages and packed app modules
	-	...other server-level folders, e.g. prisma

## License

  MIT