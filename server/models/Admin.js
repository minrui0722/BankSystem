/*
* 管理员帐号
* */
const mongoose = require('mongoose')
const schema = mongoose.Schema({
  username: { type:String },
  email: { type:String },
  password: { type:String },
  icon: { String },
  tel: { Number },
  radio: { String }
},{
  timestamps: true  //时间戳
})
module.exports = mongoose.model('Admin',schema)