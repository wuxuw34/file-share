import { Context } from "koa";
import * as fs from "fs";
import * as paths from "path";
import { copyFile } from "../utils/file";

async function rFile(ctx: Context) {
  const { name, index, hash } = ctx.request.body;
  const file = ctx.request.files as any;

  // console.log(name,index,hash,file);
  const root = process.cwd();

  const path =
    root +
    paths.sep +
    "src" +
    paths.sep +
    "public" +
    paths.sep +
    "upload" +
    paths.sep +
    name + "_" +
    paths.sep;
  const res = await copyFile(path, file.file.filepath, path + index + "-" + hash)
  if (res) {
    ctx.body = {
      state: 0,
      msg: '失败'
    }
  } else {
    ctx.body = {
      state: 1,
      msg: '成功'
    }
  }
}

export default {
  name: "/rFile",
  method: "post",
  func: rFile,
};
