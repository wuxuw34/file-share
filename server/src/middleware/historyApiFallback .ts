import { Context, Middleware } from 'koa'

export interface IOptions {
    blackList?:string[]
}

export function historyApiFallback(options?:IOptions){

    return async (ctx:Context,next:Function)=>{
        if(options?.blackList){
            let flag = true
            options.blackList.forEach(item=>{
                if(flag) flag = ! new RegExp(item).test(ctx.url)
            })
            if(flag) return next()
        }
    }
}