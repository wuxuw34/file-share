// const worker = new Worker(new URL("./worker.ts", import.meta.url), {
//   type: "module",
// });

// class WS {
//   private successFns = new Set<(value: any) => void>();

//   constructor(host?:string,port?:number|string) {
//     this.init(host,port);
//   }
//   private init(host:string,port:number|string) {
//     // console.log("init");

//     this.postMessage({ type: "init",data:{
//       host,port
//     } });
//     const that = this;
//     worker.addEventListener("message", (e: MessageEvent<any>) => {
//       this.handleMessage.apply(that, [e]); // 改变this指向，否则会指向worker，踩坑
//     });
//   }

//   private _send(data: any) {
//     // console.log(worker)
//     worker.postMessage(JSON.stringify({
//         type: "message",
//         data
//       }));
//   }

//   private handleMessage(e: any) {
//     const { type, data } = JSON.parse(e.data);
//     // console.log('接收到的消息',type,data);
    
//     switch (type) {
//       case "success": {
//         break;
//       }
//       case "error": {
//         break;
//       }
//       case "close": {
//         break;
//       }
//       case "message": {
//         this.onSuccessTrigger(data);
//         break;
//       }
//     }
//   }

//   private postMessage(data: any) {
//     worker.postMessage(JSON.stringify(data));
//   }

//   onSuccessRegister(fn: (data: any) => void) {
//     this.successFns.add(fn);
//   }

//   private onSuccessTrigger(data: any) {
//     return Promise.resolve(Array.from(this.successFns).map((fn) => fn(data)));
//   }

//   sendMsg(data: any) {
//     this._send(data);
//   }
// }

// export default WS;

// export const ws = new WS();
