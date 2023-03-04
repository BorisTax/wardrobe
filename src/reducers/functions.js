export const Status = {
    FREE: 'FREE',
    SELECT: 'SELECT',
    CREATE: 'CREATE',
    DRAWING: 'DRAWING',
    CANCEL: 'CANCEL',
    PAN: 'PAN',
    MEASURE: 'MEASURE',
}

export const getNewDate = ()=>{
    return new Date().toISOString().substr(0, 10)
}


export function isMobile(){
    return (navigator.maxTouchPoints > 1) 
}



