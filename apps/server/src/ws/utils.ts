export default function checkWS(req: Request){
    if(req.headers.get('upgrade') !== 'websocket'){
        return false //not a WS
    }
    return true // a WS
}