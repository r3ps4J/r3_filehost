import Koa from "koa";
import Router from "@koa/router";
import serve from "koa-static";
import mount from "koa-mount";
import formidable from "formidable";
import { setHttpCallback } from "@citizenfx/http-wrapper";
import path from "path";
import fs from "fs";

const app = new Koa();
const router = new Router();

const baseUrl = `https://${GetConvar("web_baseUrl", "nothing")}/r3_filehost`;
const uploadsPath = GetConvar("filehost_uploadsPath", path.join(GetResourcePath("r3_filehost"), "/uploads"));

if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
}

router.get("/", (ctx, next) => {
    ctx.set("Content-Type", "text/html");
    ctx.status = 200;
    ctx.body = `
        <html>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                }
            </style>
            <body>
                <h2>r3_filehost</h2>
                <form action="/r3_filehost/api/upload" enctype="multipart/form-data" method="post">
                    <div>File: <input type="file" name="koaFiles" /></div>
                    <input type="submit" value="Upload" />
                </form>
            </body>
        </html>
    `;
});

function getFirstFile(files: formidable.Files): formidable.File {
    for (const name in files) {
        if (Object.prototype.hasOwnProperty.call(files, name)) {
            const fileArray = files[name];
            for (const file of fileArray) {
                return file;
            }
        }
    }
}

router.post("/api/upload", async (ctx, next) => {
    const apiKey = GetConvar("filehost_apiKey", "false");
    if (apiKey != "false" && ctx.headers["x-api-key"] != apiKey) {
        ctx.throw(401, "Unauthorized");
        return;
    }

    const form = formidable({
        uploadDir: uploadsPath,
        keepExtensions: true,
        maxFiles: 1,
    });

    await new Promise<void>((resolve, reject) => {
        form.parse(ctx.req, (err, fields, files) => {
            if (err) {
                reject(err);
                return;
            }

            const file = getFirstFile(files);

            ctx.set("Content-Type", "application/json");
            ctx.status = 200;
            ctx.state = {
                fileName: file.newFilename,
                baseUrl: baseUrl,
                path: `/uploads/${file.newFilename}`,
                url: `${baseUrl}/uploads/${file.newFilename}`,
            };
            ctx.body = JSON.stringify(ctx.state);
            resolve();
        });
    });
});

app.use(mount("/uploads", serve(uploadsPath)));
app.use(router.routes()).use(router.allowedMethods());

setHttpCallback(app.callback());
console.log(`r3_filehost can be reached on ${baseUrl}`);
