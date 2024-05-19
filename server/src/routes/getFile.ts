import { Context } from "koa";
import * as fs from "fs";
import * as paths from "path";
import random from "../utils/nanoid";
import { MysqlResult } from "../types";
import query from "../utils/mysqlInstance";
import createHistory from "../utils/createHistory";
import { readFile } from "../utils/file";

async function getFile(ctx: Context) {

    const { filename } = ctx.request.query
    const root = process.cwd();

    const path =
    root +
    paths.sep +
    "src" +
    paths.sep +
    "public"+
    paths.sep+
    "upload" +
    paths.sep

    const res = await readFile(path + filename)

    console.log('文件', res);

    ctx.set("Content-disposition", "filename=" + filename)

    ctx.body = res
}

export default {
    name: "/getFile",
    method: "get",
    func: getFile,
};
