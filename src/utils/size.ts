
const symbols = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

export function convert(bytes:number){
   let exp =  Math.floor(Math.log(bytes)/Math.log(2))
    console.log(exp);
    if(exp < 1){
        exp = 0
    }
    const flag = Math.floor(exp/10)
    bytes = bytes / Math.pow(2,10*flag)
    if (bytes.toString().length > bytes.toFixed(2).toString().length) {
        bytes = Number(bytes.toFixed(2));
    }
    return bytes + symbols[flag]
}