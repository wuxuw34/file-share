import { Context } from "koa";
import query from "../utils/mysqlInstance";
import { MysqlResult } from "../types";

async function handleResult(ctx:Context){
    console.log(ctx.request.query);
    
    const {code,type} = ctx.request.query
    console.log('code=',code);
    
    // 直接输入码，没有类型需要判断
    
    
    const res = await query('select text from text where code = ?',[code]) as MysqlResult
    console.log('结果',res);
    
    if(res.state === 1){
        ctx.body = {
            state:1,
            msg:"查询成功",
            data:{
                text:res.results[0].text
            }
        }
    }else{
        ctx.body = {
            state:0,
            msg:res.msg,
        }
    }
}

export default {
    name:'/res',
    func:handleResult,
    method: 'get'
}