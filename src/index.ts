import Koa from "koa";
import Router from "@koa/router";
import formidable from "formidable";
import { setHttpCallback } from "@citizenfx/http-wrapper";

const app = new Koa();
const router = new Router();

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

router.post("/api/upload", async (ctx, next) => {
    const form = formidable({});

    await new Promise<void>((resolve, reject) => {
        form.parse(ctx.req, (err, fields, files) => {
            if (err) {
                reject(err);
                return;
            }

            ctx.set("Content-Type", "application/json");
            ctx.status = 200;
            ctx.state = { fields, files };
            ctx.body = JSON.stringify(ctx.state, null, 2);
            resolve();
        });
    });
});

app.use(router.routes()).use(router.allowedMethods());

setHttpCallback(app.callback());
console.log(`r3_filehost can be reached on ${baseUrl}`);
