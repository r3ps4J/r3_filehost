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

const onFxServer = globalThis.GetConvar != undefined;
const port = process.env.PORT ?? 3000;
const basePath = onFxServer ? GetResourcePath("r3_filehost") : path.dirname(__dirname);

function getBaseUrl(): string {
    if (!onFxServer) {
        return `http://localhost:${port}`;
    }
    return `https://${GetConvar("web_baseUrl", "nothing")}/r3_filehost`;
}

function getUploadsPath(): string {
    if (!onFxServer) {
        return path.join(basePath, "/uploads");
    }
    return GetConvar("filehost_uploadsPath", path.join(basePath, "/uploads"));
}

const baseUrl = getBaseUrl();
const uploadsPath = getUploadsPath();

if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
}

router.get("/", async (ctx, next) => {
    ctx.set("Content-Type", "text/html");
    ctx.status = 200;
    ctx.body = fs.createReadStream(path.join(basePath, "/assets", "index.html"));
    await next();
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
    const apiKey = onFxServer ? GetConvar("filehost_apiKey", "false") : process.env.API_KEY ?? "false";
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
    await next();
});

app.use(mount("/uploads", serve(uploadsPath)));
app.use(router.routes()).use(router.allowedMethods());

function listen(cb: () => void) {
    if (!onFxServer) {
        app.listen(port, cb);
        return;
    }
    setHttpCallback(app.callback());
    cb();
}

listen(() => {
    console.log(`r3_filehost can be reached on ${baseUrl}`);
});
