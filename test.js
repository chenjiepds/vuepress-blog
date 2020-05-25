let name = 'now';
let age = 18;

let fun = () => {
    console.log('into fun');
    name = 'change'
}

module.exports = {
    name,
    fun
}
console.log(module)
// appJsBridge\index.js
// var { name, fun } = require('./util/index.js')