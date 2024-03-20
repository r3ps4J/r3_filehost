import Koa from "koa";
import { setHttpCallback } from "@citizenfx/http-wrapper";

const app = new Koa();

app.use(async (ctx) => {
    ctx.body = "Hello World";
});

setHttpCallback(app.callback());
