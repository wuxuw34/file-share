
export function handlePickUpCode(type:string,code:string){

    
    
    if(window.$baseURL){
        return location.origin + '/#/res?type=' + type + '&code=' + code
    }else{

    }

}