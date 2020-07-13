/*
* 所有的 活期取款 的数据库字段信息
* */
const mongoose = require('mongoose')
const schema = mongoose.Schema({
  name: { type: String }, // 卡主
  number: { type:Number }, // 卡号
  bankCategory: { type: String }, //银行类别
  money: { type: Number },// 取款金额
  balance: { type: Number },//余额
},{
  timestamps: true  //时间戳
})
module.exports = mongoose.model('DrawFixed',schema)