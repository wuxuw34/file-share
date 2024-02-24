import sparkmd5 from 'spark-md5'

self.onmessage = (e)=>{
    const {chunks} = e.data 
    const spark = sparkmd5.ArrayBuffer
    
    if(Array.isArray(chunks)){
        chunks.forEach((i:any)=>{
            i.hash = spark.hash(i.chunk)
        })
    }else{
        chunks.hash = spark.hash(chunks.file)
    }

    self.postMessage({
        chunks
    })
}
