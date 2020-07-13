/*
*开户信息
* */
const mongoose = require('mongoose')
const schema = mongoose.Schema({
  name: { type: String },
  gender: { type: String }, // "1"表示男；“2”表示女
  phone: { type: Number },
  ID: { type: String },
  address: { type: String },
  bankCategory: { type: String },
  password: { type: String },
  number: { type: Number },
  balance: { type: Number }
},{
  timestamps: true  //时间戳
})
module.exports = mongoose.model('Account',schema)