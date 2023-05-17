"use strict";const path=require("path");const{fs}=require("@genx/sys");const request=require("supertest");const assert=require("assert");const WebServer=require("../../WebServer");const WORKING_DIR=path.resolve(__dirname,"../../../test/temp");const book1JS=`
 class Controller {
     async find(ctx) {
         ctx.body = 'book1';
     };
 }
 module.exports = Controller;
 `;const book2JS=`
 class Controller {
     async find(ctx) {
         ctx.body = 'book2';
     };
 }
 module.exports = Controller;
 `;const book3JS=`
 class Controller {
     async post(ctx) {
         ctx.body = 'book3';
     };
 }
 module.exports = Controller;
 `;const book4JS=`
 class Controller {
     async findById(ctx,bookId) {
         ctx.body = 'book4-id:' + bookId;
     };

     async updateById(ctx,bookId) {
        ctx.body = 'book4-id:' + bookId;
    };
 }
 module.exports = Controller;
 `;const book5JS=`
 class Controller {
     async find(ctx) {
        ctx.body = 'book5';
     };
 }
 module.exports = Controller;
 `;const book6JS=`
 class Controller {
     async find(ctx) {
        ctx.body = 'book6';
     };

     async updateById(ctx,book6Id) {
        ctx.body = 'book6-id:' + book6Id;
     };
 }
 module.exports = Controller;
 `;describe("unit:router:load-router",async function(){let webServer;before(async function(){fs.emptyDirSync(WORKING_DIR);let resourcesPath=path.join(WORKING_DIR,"server","resources");fs.ensureDirSync(resourcesPath);fs.writeFileSync(path.join(resourcesPath,"book1.js"),book1JS);fs.ensureDirSync(resourcesPath+"/me");fs.writeFileSync(path.join(resourcesPath,"me/book2.js"),book2JS);fs.ensureDirSync(resourcesPath+"/me/info");fs.writeFileSync(path.join(resourcesPath,"me/info/book3.js"),book3JS);fs.writeFileSync(path.join(resourcesPath,"me/info/book6.js"),book6JS);fs.ensureDirSync(resourcesPath+"/me/info/detail");fs.writeFileSync(path.join(resourcesPath,"me/info/detail/book4.js"),book4JS);fs.writeFileSync(path.join(resourcesPath,"me/info/detail/book5.js"),book5JS);webServer=new WebServer("test server",{workingPath:WORKING_DIR,logger:{level:"verbose"}});webServer.once("configLoaded",()=>{webServer.config={"koa":{},"middlewares":["koa-body","koa-override"],"routing":{"/api":{"gaml":{"remaps":{"me/info/detail/book4":"/book4","me/info/book6":"/user/:userId/book6"}}}}}});return webServer.start_()});describe("loader router",async function(){it("/api/book-1",function(done){request(webServer.httpServer).get("/api/book-1").set("Accept","application/json").expect(200).then(res=>{assert(res.text,"book1");done()}).catch(err=>done(err))});it("GET:/api/me/book-2",function(done){request(webServer.httpServer).get("/api/me/book-2").set("Accept","application/json").expect(200).then(res=>{assert(res.text,"book2-id:1");done()}).catch(err=>done(err))});it("POST:/api/me/info/book-3",function(done){request(webServer.httpServer).post("/api/me/info/book-3").set("Accept","application/json").expect(200).then(res=>{assert(res.text,"book3");done()}).catch(err=>done(err))});it("remaps GET:/api/book4",function(done){request(webServer.httpServer).get("/api/book4/1").set("Accept","application/json").expect(200).then(res=>{assert(res.text,"book4-id:1");done()}).catch(err=>done(err))});it("remaps PUT:/api/book4",function(done){request(webServer.httpServer).put("/api/book4/1").set("Accept","application/json").expect(200).then(res=>{assert(res.text,"book4-id:1");done()}).catch(err=>done(err))});it("remaps PUT:/api/book4",function(done){request(webServer.httpServer).put("/api/book4/1").set("Accept","application/json").expect(200).then(res=>{assert(res.text,"book4-id:1");done()}).catch(err=>done(err))});it("GET:/api/me/:meId/info/detail/book-5",function(done){request(webServer.httpServer).get("/api/me/info/detail/book-5").set("Accept","application/json").expect(200).then(res=>{assert(res.text,"book5-id:1");done()}).catch(err=>done(err))});it("remaps GET:/api/user/:userId/book6",function(done){request(webServer.httpServer).get("/api/user/6/book6").set("Accept","application/json").expect(200).then(res=>{assert(res.text,"book6-id:6");done()}).catch(err=>done(err))});it("remaps PUT:/api/user/:userId/book6/:book6Id",function(done){request(webServer.httpServer).put("/api/user/6/book6/6").set("Accept","application/json").expect(200).then(res=>{assert(res.text,"book6-id:6-book:6");done()}).catch(err=>done(err))})});after(async function(){await webServer.stop_();fs.removeSync(WORKING_DIR)});after(async function(){})});
//# sourceMappingURL=load-router-folder.spec.js.map