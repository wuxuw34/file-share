import { MysqlResult } from "../types";
import query from "./mysqlInstance";

 function createHistory(code: string, type: string) {
  
  return new Promise(async (resolve,rej)=>{
    const res = (await query("insert into history values (null,?,?)", [
        code,
        type,
      ])) as MysqlResult;

      
    resolve(res.state === 1)
  })
}

export default createHistory
