import koa from "koa";
import koaBody from "koa-body";
import router from './routes/index'
import koaBodyParser from 'koa-bodyparser'
import http from 'http'
import { createPeerServer } from "./peer";
import { historyApiFallback } from "./middleware/historyApiFallback ";
import koaStatic from 'koa-static'
import path from 'path'

const app = new koa()
const server = http.createServer(app.callback())


createPeerServer()


app.use(koaStatic(path.join(__dirname+'/public')))
// 处理请求头
app.use(async (ctx, next) => {
  ctx.set({
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Methods":"OPTIONS,GET,PUT,POST,DELETE"
  })
  ctx.response.status = 200
  try{
    await next()
  }catch(err:any){
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.body = {
      message: err.message
    }
  }
});

// app.use(historyApiFallback({
//   blackList:['/res']
// }))

// 处理post传参
app.use(
  koaBody({
    multipart: true,
  })
);
app.use(koaBodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

server.listen(8083, () => {
  console.log("服务器启动");
});
