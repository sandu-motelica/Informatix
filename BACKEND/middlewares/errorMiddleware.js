export default (res,status, message, errors=[] )=>{
    res.statusCode = status;
    res.end(JSON.stringify({message,errors}));
    return;
}