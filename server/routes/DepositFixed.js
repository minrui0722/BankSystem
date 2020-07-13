/*
* 所有关于  定期存款  的相关路由
* */
module.exports = app => {
  const express = require('express')
  const DepositRouter = express.Router()
  const DepositFixed = require('../models/DepositFixed')
  const Account = require('../models/Account')

  // 每提交一次，都是一条记录生成操作明细
  DepositRouter.post('/deposit',async (req,res) => {
    /*根据用户输入的卡号，找到对应 开户表 中对应卡号的所有信息*/
    const number = req.body.number
    const result = await Account.find({number})
    if(result.length === 0){
      return res.send('卡号不存在！')
    }else{
      /*由于增加了存款，所以修改 开户表 中的余额 = 原余额 + 存款金额*/
      const newBalance = parseFloat(result[0].balance) + parseFloat(req.body.money)
      await Account.update({number},{$set:{"balance": newBalance}})
      /*将 卡主、卡号、存款金额、期限、利息、银行类别、余额存入deposit表中*/
      const newModel = await Account.find({number})
      req.body.bankCategory = newModel[0].bankCategory
      req.body.name = newModel[0].name
      req.body.balance = newModel[0].balance
      const model = await DepositFixed.create(req.body)
      /*返回响应数据*/
      res.send(model)
    }
  })

  // 获取数据库中所有存款操作的记录
  DepositRouter.get('/deposit',async (req,res) => {
    const items = await DepositFixed.find()
    res.send(items)
  })

  // 删除指定 id 对应存款记录
  DepositRouter.delete('/deposit/:id',async (req,res) => {
    await DepositFixed.findByIdAndRemove(req.params.id)
    res.send({
      success: true
    })
  })

  app.use('/bank/admin/api',DepositRouter)
}