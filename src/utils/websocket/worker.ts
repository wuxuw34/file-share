// function postMessage(data: any) {
//   self.postMessage(JSON.stringify(data));
// }

// let connection: WebSocket | null = null; // socket实例
// let heartTimer: any = null; // 心跳计时器
// const msgs: any[] = []; // 堆积的消息

// const reconnectMax = 100; // 重连次数
// let reconnect = 0; // 已经重连次数
// let isConnecting = false; // 是否处于连接状态
// let timer: any = null; // 重连计时器

// function initWS(host:string,port:number|string) {
//   connection?.removeEventListener("message", handleOpen);
//   connection?.removeEventListener("message", handleMessage);
//   connection?.removeEventListener("error", handleError);
//   connection?.removeEventListener("close", handleClose);
//   connection = new WebSocket(host&&port?`ws://${host}:${port}`:"ws://192.168.31.196:8083");
//   connection?.addEventListener("message", handleOpen);
//   connection?.addEventListener("message", handleMessage);
//   connection?.addEventListener("error", handleError);
//   connection?.addEventListener("close", handleClose);
// }

// // 处理连接
// function handleOpen() {
//   // console.log("websocket connected");
//   postMessage({
//     type: "success", // 连接成功
//   });
//   // 连接成功就把堆积的消息推送到服务器
//   msgs.forEach((msg) => {
//     sendMsg(msg);
//   });
//   // 清空消息
//   msgs.length = 0;
// }
// // 处理消息
// function handleMessage(e: any) {
//   const { data } = e;
//   postMessage({
//     type: "message",
//     data,
//   });
// }
// // 处理错误
// function handleError() {
//     // console.log('error');
    
//   postMessage({
//     type: "error",
//   });
//   if (isConnecting) return;
//   isConnecting = true;
//   if (timer) {
//     clearTimeout(timer);
//   }
//   // 达到最大重连次数，不再进行连接
//   if (reconnect > reconnectMax) {
//     reconnect = 0;
//     return;
//   }
//   timer = setTimeout(() => {
//     initWS();
//     reconnect++;
//   }, 2000);
// }
// // 处理关闭
// function handleClose() {
//   // console.log("webSocket closed");

//   postMessage({
//     type: "close",
//   });
// }

// // 心跳检测
// function heartCheck() {
//   heartTimer = setInterval(() => {
//     // console.log('websocket is reconnecting')
//     sendMsg({
//       type: 0,
//     });
//   }, 10000);
// }

// function closeHeartCheck() {
//   if (heartTimer) {
//     setInterval(heartTimer);
//   }
// }

// // 发送消息到服务器
// function sendMsg(data: any) {
//     // console.log('发送',data);
    
//   connection?.send(JSON.stringify(data));
// }

// self.onmessage = (e: any) => {
//   const { type, data } = JSON.parse(e.data);
//   // console.log(type,data);
  
//   switch (type) {
//     case "init": {
//       const {host,port} = data
//       initWS(host,port);
//       break;
//     }
//     case "message": {
//         // console.log('消息',connection?.readyState);
        
//       if (connection?.readyState !== 1) {
//         if (connection?.readyState === 3) {
//           msgs.push(data);
//           initWS();
//         }
//         return;
//       }
//       sendMsg(data);
//       break;
//     }
//   }
// };
