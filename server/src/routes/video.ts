import { Context } from 'koa'
import query from '../utils/mysqlInstance';
import random from "../utils/nanoid";
import createHistory from "../utils/createHistory";

async function say(ctx:Context){

    let { screens } = ctx.request.body;

    const code = random()
    console.log('video',screens);
    
    const res = await query('insert into video values (null,?,?)',[code,screens])
    console.log(res);
    

    const r = await createHistory(code, "video");
    console.log('结果',r);
    
    if (r) {
      ctx.body = {
        state: 1,
        msg: "获取code成功",
        data: {
          code: code,
        },
      };
    }
}

export default {
    name:'/videos',
    method:'post',
    func:say
}