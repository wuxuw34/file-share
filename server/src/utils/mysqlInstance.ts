import * as mysql from "mysql";
import config from "../middleware/Config";
import { MysqlResult } from "../types";

const pool = mysql.createPool(config.db_config);

export default function query(sql: string, params?: Array<any>) {
  const result: MysqlResult = {
    state: 0,
    results: null,
  };
  console.log(1);

  return new Promise((res, rej) => {
    pool.getConnection((err, connection) => {
      console.log(2);

      if (err) {
        result.error = err;
        result.msg = "数据库连接错误";
        res(result);
      } else {
        console.log(888);

        const callback: mysql.queryCallback = (err, results, fields) => {
          console.log(3);

          if (err) {
            result.error = err;
            result.msg = "数据库查询出错";
            res(result);
          } else {
            connection.release();
            result.state = 1;
            result.msg = "ok";
            result.results = results;
            result.fields = fields;
            res(result);
          }
          
        };
        if (params) {
            connection.query(sql, params, callback);
          } else {
            connection.query(sql, callback);
          }
      }
    });
  });
}
