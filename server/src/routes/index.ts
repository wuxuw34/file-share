import KoaRouter from 'koa-router'
import * as fs from 'fs'

const router = new KoaRouter()

router.post('/s',async (ctx,next)=>{

    // ctx.body = {
    //     is:'11'
    // }
    ctx.body = '22'
    // console.log(ctx)
    await next()
})

// 处理各种请求
fs.readdirSync(__dirname).forEach(file=>{
    if(file !== 'index.ts'){
        const name = file.replace('.ts','')
        // console.log(name);
        
        const f = import(__dirname+'/'+file)
        f.then((res)=>{
            const q = res.default
            if(q.method === 'get'){
                router.get(q.name,q.func)
            }else if(q.method === 'post'){
                router.post(q.name,q.func)
            }
        })
    }
})

export default router