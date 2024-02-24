import { PeerServer } from "peer";

export function createPeerServer() {
  const peerServer = PeerServer({
    port: 9000,
    path: "/myapp",
  });
  peerServer.on('connection',(client:any)=>{
  
    // console.log('一个用户连进服务器',client);
    client.send({
      name:'11'
    })
    
  })
}
