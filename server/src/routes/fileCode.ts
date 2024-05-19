import { Context } from "koa";
import * as fs from "fs";
import * as paths from "path";
import random from "../utils/nanoid";
import { MysqlResult } from "../types";
import query from "../utils/mysqlInstance";
import createHistory from "../utils/createHistory";

async function qFileCode(ctx: Context) {
  const { fileList } = ctx.request.body;

  const randomNumber = random();
  const res = (await query("insert into file values(null,?,?,?)", [
    fileList,
    new Date(),
    randomNumber,
  ])) as any;
  console.log('结果',res.length);
  
  if (res.length >= 1) {
    const r = await createHistory(randomNumber, "file");
    console.log('结果',r);
    
    if (r) {
      ctx.body = {
        state: 1,
        msg: "获取code成功",
        data: {
          code: randomNumber,
        },
      };
    }
  }
}

export default {
  name: "/qfilecode",
  method: "post",
  func: qFileCode,
};
