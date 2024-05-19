import mysql from 'mysql2/promise';
import config from "../middleware/Config";
import { MysqlResult } from "../types";

const pool = mysql.createPool(config.db_config);

export default function query(sql: string, params?: Array<any>) {
  const result: MysqlResult = {
    state: 0,
    results: null,
  };
  console.log(1);

  return new Promise(async (resolve: any, reject: any) => {
    const conn = await pool.getConnection()
    conn.query(sql, params).then(res => {
      resolve(res)
    }).catch(err => {
      resolve(err)
    }).finally(() => {
      conn.release()
    })
  });
}
