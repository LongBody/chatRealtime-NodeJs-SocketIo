let os = require("os")
let platform = os.platform();
console.log(platform)

const crypto = require("crypto");

let str = "abcxyz";
let strHashed = hashMd5(str);
console.log(strHashed)

function hashMd5(str) {
    return crypto.createHash("md5").update(str).digest("binary")
}