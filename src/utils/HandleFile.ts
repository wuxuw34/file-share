/**
 *
 * @param file 文件
 * @param size 分片大小
 */
export function createFileChunk(file: File, size?: number) {
  const filechunkList = [];
  size = size ? size : 10 * 1024 * 1024 * 8;
  let start = 0,
    index = 0;
  if (file.size === 0) {
    filechunkList.push({
      chunk: null,
      index: 0,
    });
  } else {
    while (start < file.size) {
      filechunkList.push({
        chunk: file.slice(start, start + size),
        index: index,
      });
      start += size;
      index++;
    }
  }

  return filechunkList;
}
