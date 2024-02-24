
import { WebSocket } from "ws";

declare module 'koa-static';

export interface MysqlResult {
    state: number; // 为1时成功
    results: any; // 执行结果
    fields?: Array<mysql.FieldInfo>; // 状态
    error?: mysql.MysqlError; // 错误状态
    msg?: string; // 错误描述
  }

  declare type WebSocket = {
    join:any
  }