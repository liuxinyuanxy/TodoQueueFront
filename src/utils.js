const prefix = "http://124.221.92.18:1323";
// const prefix = "http://10.186.64.125:1323";

function GenerateFormDataFromObject(obj) {
    let result = new FormData()
    for (let item in obj) {
        result.append(item, obj[item])
    }
    return result
}
function Fetch(url, method, body, type) {
    return type === undefined ? fetch(prefix + url, {
        method: method,
        mode: 'cors',
        credentials: "include",
        body: body
    }) : fetch(prefix + url, {
        method: method,
        mode: 'cors',
        headers: {
            "Content-type": type,
        },
        credentials: "include",
        body: body
    })
}

export { GenerateFormDataFromObject, Fetch }