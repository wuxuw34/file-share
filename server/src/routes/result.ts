import { Context } from "koa";
import query from "../utils/mysqlInstance";
import { MysqlResult } from "../types";

async function handleResult(ctx: Context) {
    console.log(ctx.request.query);

    const { code, type } = ctx.request.query
    let res = null, r = null

    switch (type) {
        case 'file': {
            res = (await query('select files from file where code = ?', [code]) as any)[0][0].files
            r = {
                file_info: res
            }
            break
        }
        case 'text': {
            res = (await query('select text from text where code = ?', [code]) as any)[0][0].text
            r = {
                text: res
            }
            break
        }
        case 'screen': {
            res = await query('select screens from screens where code = ?', [code]) as any
            
            r = {
                screens: res[0][0].screens
            }
            break
        }
        case 'video': {
            res = await query('select video from video where code = ?', [code]) as any
            
            r = {
                screens: res[0][0].video
            }
            break
        }
    }



    if (res) {
        ctx.body = {
            state: 1,
            msg: "查询成功",
            data: r
        }
    } else {
        ctx.body = {
            state: 0,
            msg: '',
        }
    }
}

export default {
    name: '/res',
    func: handleResult,
    method: 'get'
}