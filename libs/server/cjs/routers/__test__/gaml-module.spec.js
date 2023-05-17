"use strict";const path=require("path");const request=require("supertest");const{fs}=require("@genx/sys");const WebServer=require("../../WebServer");const WORKING_DIR=path.resolve(__dirname,"../../../test/temp");let resourceBook=`
const { _ } = require('@genx/july');

let books = [ { id: 1, title: 'Book 1' }, { id: 2, title: 'Book 2' } ];
let maxid = 2;

exports.find = (ctx) => {
    ctx.body = books;
};

exports.post = (ctx) => {
    let newBook = {id: ++maxid, title: ctx.request.body.title};
    books.push(newBook);
    ctx.body = newBook;
};

exports.findById = (ctx, id) => {
    ctx.body =  _.find(books, book => book.id == id) || {};
};

exports.updateById = (ctx, id) => {
    let bookFound = _.find(books, book => book.id == id);

    bookFound.title = ctx.request.body.title;
    ctx.body =  bookFound;
};

exports.deleteById = (ctx, id) => {
    let idx = _.findIndex(books, book => book.id == id);
    ctx.body = books.splice(idx, 1)[0];
};
`;describe.skip("unit:router:gaml-module",function(){let webServer;before(async function(){fs.emptyDirSync(WORKING_DIR);let resourcesPath=path.join(WORKING_DIR,"server","resources");fs.ensureDirSync(resourcesPath);fs.writeFileSync(path.join(resourcesPath,"book.js"),resourceBook);webServer=new WebServer("test server",{workingPath:WORKING_DIR,logger:{level:"verbose"}});webServer.once("configLoaded",()=>{webServer.config={"koa":{},"middlewares":["koa-body","koa-override"],"routing":{"/api":{"gaml":{}}}}});return webServer.start_()});after(async function(){await webServer.stop_();fs.removeSync(WORKING_DIR)});describe("module function",function(){it("should get a list of books",function(done){request(webServer.httpServer).get("/api/book").set("Accept","application/json").expect("Content-Type",/json/).expect(200).expect(function(res){if(!Array.isArray(res.body)){return"Result is not a list"}if(res.body.length!==2){return"Unexpected result"}}).end(done)});it("should add a new book",function(done){request(webServer.httpServer).post("/api/book").send({title:"Avatar"}).set("Accept","application/json").expect("Content-Type",/json/).expect(200).expect({id:3,title:"Avatar"}).end(done)});it("should get book 2 successfully",function(done){request(webServer.httpServer).get("/api/book/2").set("Accept","application/json").expect("Content-Type",/json/).expect(200).expect({id:2,title:"Book 2"}).end(done)});it("should update book 2 successfully",function(done){request(webServer.httpServer).put("/api/book/2").send({title:"Brave Cross"}).set("Accept","application/json").expect("Content-Type",/json/).expect(200).expect({id:2,title:"Brave Cross"}).end(done)});it("should delete book 2 successfully",async function(){await request(webServer.httpServer).del("/api/book/2").set("Accept","application/json").expect("Content-Type",/json/).expect(200).expect({id:2,title:"Brave Cross"});await request(webServer.httpServer).get("/api/book/2").set("Accept","application/json").expect("Content-Type",/json/).expect(200).expect({})});it("should return 404",function(done){request(webServer.httpServer).get("/api/non_exist/1").set("Accept","application/json").expect("Content-Type","text/plain; charset=utf-8").expect(404).end(done)})})});
//# sourceMappingURL=gaml-module.spec.js.map