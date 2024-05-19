
import * as fs from "fs";


export function copyFile(path: string, from: string, to: string) {

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(path)) {
            fs.mkdir(path, (err) => {
                if (err) {
                    console.log("创建文件夹出错", err);
                } else {
                    fs.copyFile(from, to, (err) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(true)
                        }
                    })
                }
            });
        } else {
            fs.copyFile(from, to, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(true)
                }
            })
        }

    })

}

export function readFile(path: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}