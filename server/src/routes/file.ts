import { Context } from "koa";
import * as fs from "fs";
import * as paths from "path";

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
    "public"+
    paths.sep+
    "upload" +
    paths.sep +
    name+"_" +
    paths.sep;
    
  if (!fs.existsSync(path)) {
    fs.mkdir(path, (err) => {
      if (err) {
        console.log("创建文件夹出错", err);
      } else {
        fs.copyFile(file.file.filepath, path + index + "-" + hash, (err) => {
          if (err) {
            console.log("移动错误", err);
          }
        });
      }
    });
  } else {
    fs.copyFile(file.file.filepath, path + index + "-" + hash, (err) => {
      if (err) {
        console.log("移动错误");
      } else {
        ctx.body = "HEllO";
      }
    });
  }
}

export default {
  name: "/rFile",
  method: "post",
  func: rFile,
};
