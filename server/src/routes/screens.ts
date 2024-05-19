import { Context } from 'koa'
import query from '../utils/mysqlInstance';
import random from "../utils/nanoid";
import createHistory from "../utils/createHistory";

async function say(ctx:Context){

    let { screens } = ctx.request.body;

    const code = random()
    console.log('screens',screens);
    
    const res = await query('insert into screens values (null,?,?)',[code,screens])
    console.log(res);
    

    const r = await createHistory(code, "screen");
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
    name:'/screens',
    method:'post',
    func:say
}