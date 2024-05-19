import { Context } from 'koa'

function say(ctx:Context){
    ctx.body = 'HEllO'
}

export default {
    name:'/say',
    method:'get',
    func:say
}