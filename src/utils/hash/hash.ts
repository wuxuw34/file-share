const worker = new Worker(new URL("./worker.ts", import.meta.url), {
  type: "module",
});
export function calculateHash(chunks: any) {
  worker.postMessage({ chunks });
  return new Promise((resolve) => {
    worker.onmessage = (e) => {
      const { chunks } = e.data;
      resolve(chunks);
    };
  });
}
