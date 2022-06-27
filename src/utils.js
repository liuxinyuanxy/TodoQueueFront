const prefix = "http://124.221.92.18:1323";
function GenerateFormDataFromObject(obj) {
    let result = new FormData()
    for (let item in obj) {
        result.append(item, obj[item])
    }
    return result
}
function Fetch(url, method, body) {
    return fetch(prefix + url, {
        method: method,
        mode: 'cors',
        credentials: "same-origin",
        body: body
    })
}
export {GenerateFormDataFromObject, Fetch}