import { Html5Qrcode } from "html5-qrcode";
import { CSSProperties, Ref, createApp, ref } from "vue";

let html5Qrcode: Html5Qrcode | null = null;
let id: string = "reader"; // 渲染到那个元素
let statusFn: any = null,
  onScanSuccessFn: any = null,
  onScanFailFn: any = null;
let el: any = null,
  app: any = null;
let readerRef: Ref | null = null;
let tipRef: Ref | null = null;
const mask: CSSProperties = {
  position: "absolute",
  zIndex:9999,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,.45)"
};
const card: CSSProperties = {
  backgroundColor: "white",
  height: "fit-content",
  maxWidth: "500px",
  borderRadius: "5px",
};

const model = {
  props: {
    id: {
      type: String,
      default: "reader",
    },
    size: {
      type: Number,
      default: 400,
    },
  },
  render(ctx: any) {
    readerRef = ref<HTMLDivElement | null>(null);
    tipRef = ref<HTMLDivElement | null>(null);
    return (
      <div style={mask}>
        <div style={card}>
          <div
            style={{
              height: "22px",
              padding: "15px 10px",
              boxShadow: "0 0 1px 1px rgb(224, 224, 224)",
              display:'flex',
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontWeight: "500",
                color: "rgba(0,0,0,.75)",
                lineHeight: "22px",
              }}
            >
              扫码取件
            </span>
            <span
              onClick={()=>{
                stop()
              }}
            >
              
              <svg
                
                class="icon_close"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4392"
                width="22"
                fill="currentColor"
                height="22"
                
              >
                <path
                  d="M507.168 473.232L716.48 263.936a16 16 0 0 1 22.624 0l11.312 11.312a16 16 0 0 1 0 22.624L541.12 507.168 750.4 716.48a16 16 0 0 1 0 22.624l-11.312 11.312a16 16 0 0 1-22.624 0L507.168 541.12 297.872 750.4a16 16 0 0 1-22.624 0l-11.312-11.312a16 16 0 0 1 0-22.624l209.296-209.312-209.296-209.296a16 16 0 0 1 0-22.624l11.312-11.312a16 16 0 0 1 22.624 0l209.296 209.296z"
                  p-id="4393"
                ></path>
              </svg>
            </span>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              justifyContent: "center",
              height: "auto",
              padding: "10px",
              boxSizing: "border-box",
            }}
          >
            <div
              id={ctx.$props.id}
              style={{
                width: ctx.$props.size + "px",
                height: ctx.$props.size + "px",
              }}
              ref={readerRef}
            ></div>
          </div>
          <div
            ref={tipRef}
            style={{
              display: "none",
              padding: "0 10px 10px 10px",
              fontWeight: "500",
              color: "rgba(0,0,0,.75)",
              lineHeight: "22px",
            }}
          >
            请将镜头对准二维码
          </div>
        </div>
      </div>
    );
  },
};

// 获取摄像头
function getCameras() {
  window.addEventListener("click", judgeOut); // 初始化点击事件，判断点击位置
  mount()
    .then(() => {
      readerRef!.value.innerHTML = "正在获取摄像头权限";
      el.childNodes[0].childNodes[0].classList.add("show_camera"); // 添加出现动画
      return Html5Qrcode.getCameras();
    })
    .then((devices) => {
      if (devices && devices.length) {
        html5Qrcode = new Html5Qrcode(id);
        start();
      }
    })
    .catch((err) => {
      readerRef!.value.innerHTML = "失败" + err;
    });
}

function start() {
  statusFn?.('1')
  html5Qrcode
    ?.start(
      {
        facingMode: "environment",
      },
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250,
        },
      },
      onScanSuccessFn,
      onScanFailFn
    )
    .then(() => {
      // 显示提示语言
      tipRef!.value.style.display = "block";
      // 调整video大小
      const video = document.querySelector("#reader>video") as HTMLElement
      video.style.height =
        "100%";
      video.style.objectFit = "contain";
    });
}

/**
 *  动画播放完毕， 移除所有类(包含动画)
 */
function onAnimationEnd() {
  const app = el.childNodes[0].childNodes[0];
  el.childNodes[0].childNodes[0].onanimationend = () => {
    app.classList.forEach((item: any) => {
      app.classList.remove(item);
    });
  };
}

// 停止扫描二维码
function stop() {
  el.childNodes[0].childNodes[0].classList.add("remove_camera");
  el.childNodes[0].childNodes[0].onanimationend = () => {
    html5Qrcode?.stop();
    unmount();
    window.removeEventListener("click", judgeOut);
  };
}

// 挂载元素到页面上
function mount() {
  return new Promise((resolve) => {
    el = document.createElement("div");
    document.body.appendChild(el);
    app = createApp(model, {
      size: window.innerWidth - 16 > 400 ? 400 : window.innerWidth - 16,
    });
    app.mount(el);
    onAnimationEnd();
    document.body.style.overflow='hidden'
    resolve(null);
  });
}


// 判断点击位置
function judgeOut(e: MouseEvent) {
  if (
    !el.childNodes[0].childNodes[0].contains(e.target) &&
    !document.querySelector("#scanBnt")!.contains(e.target as Node)
  ) {
    stop();
  }
}

// 卸载el从body上
function unmount() {
  document.body.style.overflow='visible'
  document.body.removeChild(el);
}

/**
 * 调用摄像头扫描二维码函数
 * @param onScanSuccess 扫描成功回调
 * @param onScanFail 扫描失败回调
 */
export function scan(
  onScanSuccess: (text: string) => void,
  onScanFail: (err: string) => void,
  setStatus?: (res: string) => void
) {
  onScanSuccessFn = onScanSuccess;
  onScanFailFn = onScanFail;
  if(setStatus) statusFn = setStatus;
  getCameras();

  return {
    start,
    stop,
  };
}
