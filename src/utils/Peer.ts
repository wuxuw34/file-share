import { ref } from 'vue'
import { Peer } from "peerjs";


export function createPeer() {
    let conn: any[] = []
    let peers: any[] = []

    // let con: any = null
    const streams = ref<Array<{
        streamKey: string,
        stream: MediaStream,
        status: 0 | 1 | -1 | -2, // 0 等待发送 -1 发送失败 1 发送成功 -2 数据终止
        info:any
    }>>([])

    function createPeerConnention(key: string, index: number) {
        peers.push(new Peer(key, {
            host: "192.168.31.196",
            port: 9000,
            path: "/myapp",
            debug: 2,
            config: {
                'iceServers': [
                    { url: 'stun:stun.l.google.com:19302' },
                ]
            }
        }))
        
        peers[index].on('open', (id: string) => {
            console.log('id = ', id);

        })
        peers[index].on('connection', (conn: any) => {
            console.log('一个连接建立', conn);

            conn.on('open', () => {
                conn.send(key)
            })

            conn.on('data', (data: any) => {
                const { key } = data
                console.log('流');

                peers[index].call(key, streams.value[index].stream)
            })
        })
    }

    

    function initPeerConnection() {
        streams.value.forEach((item, index) => {
            createPeerConnention(item.streamKey, index)
        })
    }

    function requestAllScreen(screens: any[]) {
        console.log(screens)
        screens.forEach((item: {
            index: number,
            key: string
        }) => {
            callAnthorPeerConnection(item.key, item.index)
        });
        (window as any).$peers = peers
    }

    function callAnthorPeerConnection(key: string, index: number,info?:info) {
        streams.value.length = 0
        peers[index] = new Peer(null!, {
            host: "192.168.31.196",
            port: 9000,
            path: "/myapp",
            debug: 2,
            config: {
                'iceServers': [
                    { url: 'stun:stun.l.google.com:19302' },
                ]
            }
        })
        peers[index].on('open', (id: string) => {
            conn[index] = peers[index].connect(key, {
                reliable: true
            })

            conn[index].on('error', (err: any) => {
                console.log(peers[index], err);
            })
            conn[index].on('data', (data: any) => {
                console.log('接受的消息', data);

            })
            conn[index].on('open', () => {
                console.log('发送消息');

                conn[index].send({
                    key: id
                })

            })

        })

        peers[index].on('call', (call: any) => {
            console.log('被呼叫');

            call.answer()
            call.on('stream', (stream: MediaStream) => {
                let flag = false
                for (let i = 0; i < streams.value.length; i++) {
                    if (streams.value[i].stream.id === stream.id) {
                        flag = true
                    }
                }
                if (!flag) {
                    streams.value.push({
                        stream,
                        streamKey: key,
                        status: 0,
                        info
                    })
                }
                console.log(streams.value);
            })
        })
    }

    return {
        callAnthorPeerConnection,
        requestAllScreen,
        initPeerConnection,
        streams
    }
}

