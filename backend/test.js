const speakeasy = require('speakeasy');


var token = speakeasy.totp({
  secret: "5163617071725b576f6f4c67612f46563e6d233125436b373e76305e2c6e4c44",
  encoding: 'hex'
});
console.log(token);
// 
// var secret = speakeasy.generateSecret();
// 
// console.log(secret);
