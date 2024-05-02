export default (cookieHeader)=> {
    const cookies = {};
    if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            const key = parts.shift().trim();
            const value = decodeURIComponent(parts.pop());
            cookies[key] = value;
        });
    }
    return cookies;
}