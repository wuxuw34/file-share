import { Context } from "koa";
import query from "../utils/mysqlInstance";
import random from "../utils/nanoid";
import { MysqlResult } from "../types";
import createHistory from "../utils/createHistory";

async function getText(ctx: Context) {
  const text = JSON.parse(ctx.request.body)["content"];
  const randomNumber = random();
  const res = (await query("insert into text values(null,?,?,?)", [
    text,
    new Date(),
    randomNumber,
  ])) as any;

  if (res.length >= 1) {
    const r = await createHistory(randomNumber, "text");
    if (r) {
      ctx.response.body = {
        state: 1,
        msg: "成功",
        data: {
          code: randomNumber,
        },
      };
    } else {
      ctx.response.body = {
        state: 0,
        msg: "出现错误",
      };
    }
  } else {
    ctx.response.body = {
      state: 0,
      msg: res.msg,
    };
  }
}

export default {
  name: "/texts",
  func: getText,
  method: "post",
};
