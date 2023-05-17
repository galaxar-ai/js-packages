/**
 * Module dependencies.
 */

import path from "node:path";
import request from "supertest";
import sh from "shelljs";
import WebServer from "../lib";

const WORKING_DIR = path.resolve(__dirname, 'fixtures/server-only');

describe('server-only', function () {
    let webServer;

    before(async function () {
        webServer = new WebServer('test server', { 
            workingPath: WORKING_DIR
        });

        return webServer.start_();
    });

    after(async function () {        
        await webServer.stop_();        
        sh.rm('-rf', path.join(WORKING_DIR, '*.log'));
    });

    describe('middleware:serveStatic', function () {
        it('should return static page by visiting web root', function (done) {
            request(webServer.httpServer)
                .get('/')
                .expect('content-type', 'text/html; charset=utf-8')
                .expect(/<title>Static Page<\/title>/)
                .expect(200)
                .end(done);
        });
        it('should return static page by visiting the page url', function (done) {
            request(webServer.httpServer)
                .get('/text-file.txt')
                .expect('content-type', 'text/plain; charset=utf-8')
                .expect('This is a test file.')
                .expect(200)
                .end(done);
        });
    });    
});