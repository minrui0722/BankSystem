/*
* 所有关于  活期取款  的相关路由
* */
module.exports = app => {
  const express = require('express')
  const DrawFixedRouter = express.Router()
  const DrawFixed = require('../models/DrawFixed')
  const Account = require('../models/Account')
  const DepositFixed = require('../models/DepositFixed')

  // 每提交一次，都是一条记录生成操作明细
  DrawFixedRouter.post('/draw',async (req,res) => {
    /*根据用户输入的卡号，找到对应 开户表 中对应卡号的所有信息*/
    const number = req.body.number
    const result = await Account.find({number})
    if(result.length === 0){
      return res.send('卡号不存在！')
    }else{
      /*找到对应卡号中是否存在定期存款，如果存在，则余额应该排除定期存款金额（冻结金额）*/
      const depositItem = await DepositFixed.find({number})
      let newBalance
      let fixedMoney
      let balanceMeg
      if(depositItem.length === 0){     // 没有冻结的定期存款资金
        /*由于取款，所以修改 开户表 中的余额 = 原余额 - 取款金额*/
        newBalance = parseFloat(result[0].balance) - parseFloat(req.body.money)
        fixedMoney = 0    // 由于没有定期存款操作，所以冻结资金为0元
        balanceMeg = parseFloat(result[0].balance)  // 取款之前的余额

      }else{      // 有冻结的定期存款资金
        newBalance = parseFloat(result[0].balance) - parseFloat(depositItem[0].money) - parseFloat(req.body.money)
        fixedMoney = parseFloat(depositItem[0].money)   // 冻结资金
        balanceMeg = parseFloat(result[0].balance) - parseFloat(depositItem[0].money)  // 取款之前的余额

      }
      if(newBalance < 0){
        return res.send({
          message: '可取款余额不足！',
          balance: balanceMeg,
          fixedMoney: fixedMoney
        })
      }

      if(fixedMoney === 0){
        await Account.update({number},{$set:{"balance": newBalance}})
      }else{// 这里的余额还是要加上已冻结的资金
        await Account.update({number},{$set:{"balance": newBalance + parseFloat(depositItem[0].money)}})
      }

      /*将 卡主、卡号、存款金额、期限、利息、银行类别、余额存入deposit表中*/
      const newModel = await Account.find({number})
      req.body.bankCategory = newModel[0].bankCategory
      req.body.name = newModel[0].name
      req.body.balance = newModel[0].balance
      const model = await DrawFixed.create(req.body)
      /*返回响应数据*/
      res.send(model)
    }
  })

  // 获取数据库中所有存款操作的记录
  DrawFixedRouter.get('/draw',async (req,res) => {
    const items = await DrawFixed.find()
    res.send(items)
  })

  // 删除指定 id 对应存款记录
  DrawFixedRouter.delete('/draw/:id',async (req,res) => {
    await DrawFixed.findByIdAndRemove(req.params.id)
    res.send({
      success: true
    })
  })

  app.use('/bank/admin/api',DrawFixedRouter)
}