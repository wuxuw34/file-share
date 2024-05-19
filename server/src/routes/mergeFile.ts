import { Context } from "koa";
import * as fs from "fs";
import * as paths from "path";
import random from "../utils/nanoid";
import { MysqlResult } from "../types";
import query from "../utils/mysqlInstance";
import createHistory from "../utils/createHistory";

async function mFile(ctx: Context) {
  let { name, hash, chunksize } = ctx.request.body;
  chunksize = parseInt(chunksize);
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
    name +
    "_" +
    paths.sep;
  const savePath =
    root +
    paths.sep +
    "src" +
    paths.sep +
    "public" +
    paths.sep +
    "upload" +
    paths.sep;

  fs.readdir(path, async (err, files) => {
    if (err) {
      console.log("读取文件夹错误", err);
    } else {
      const pipe = (files: any[], wsp: any) => {
        if (files.length <= 0) {
          return;
        }

        const rs = fs.createReadStream(path + files[0]);
        const ws = fs.createWriteStream(wsp, {
          flags: "a",
        });

        rs.on("end", () => {
          fs.unlinkSync(path + files[0]);
          files.shift();
          pipe(files, wsp);
        });

        rs.pipe(ws);
      };
      const filelist = files
        .filter((i) => i !== name)
        .sort(
          (a, b) =>
            parseInt(a.substring(0, a.indexOf("-"))) -
            parseInt(b.substring(0, b.indexOf("-")))
        );

      setTimeout(() => {
        pipe(filelist, savePath + name);
      }, 0);
    }
  });

  ctx.response.body = {
    state: 1,
    msg: "合并成功",
    data: {
      url: "http://localhost:8083/upload/" + name
    },
  }
}

export default {
  name: "/mFile",
  method: "post",
  func: mFile,
};
