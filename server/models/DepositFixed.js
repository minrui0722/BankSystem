/*
* 所有的 定期存款 的数据库字段信息
* */
const mongoose = require('mongoose')
const schema = mongoose.Schema({
  name: { type: String }, // 卡主
  number: { type:Number }, // 卡号
  bankCategory: { type: String }, //银行类别
  interest: { type: Number }, //利息
  duration: { type: String }, //存款期限
  money: { type: Number },// 存款金额
  balance: { type: Number },//余额
},{
  timestamps: true  //时间戳
})
module.exports = mongoose.model('Deposit',schema)