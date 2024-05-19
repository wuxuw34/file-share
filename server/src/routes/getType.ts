import { Context } from "koa";
import query from "../utils/mysqlInstance";
import { MysqlResult } from "../types";

async function handleResult(ctx: Context) {
    console.log(ctx.request.query);

    const { code } = ctx.request.query
    let _type = null

    // 直接输入码，没有类型需要判断


    _type = await query('select type from history where code = ?', [code]) as any


    if (_type) {
        ctx.body = {
            state: 1,
            msg: "查询成功",
            data: {
                type: _type[0][0].type
            }
        }
    } else {
        ctx.body = {
            state: 0,
            msg: '获取失败',
        }
    }
}

export default {
    name: '/getType',
    func: handleResult,
    method: 'get'
}