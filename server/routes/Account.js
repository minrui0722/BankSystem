/*
* 所有关于开户的相关路由
* */
module.exports = app => {
  const express = require('express')
  const AccountRouter = express.Router()
  const Account = require('../models/Account')
  const DepositFixed = require('../models/DepositFixed')
  const DepositCurrent = require('../models/DepositCurrent')
  const DrawFixed = require('../models/DrawFixed')

  // 接受用户的 开户信息 ，保存在数据库中
  AccountRouter.post('/account',async (req,res) => {
    const model = await Account.create(req.body)
    res.send(model)
  })
  // 请求数据库中的所有开户信息
  AccountRouter.get('/account',async (req,res) => {
    const modelItems = await Account.find()
    res.send(modelItems)
  })
  // 删除对应 ID 的开户信息
  AccountRouter.delete('/account/:id',async (req,res) => {
    /*删除开户列表中的记录*/
    const result = await Account.findByIdAndRemove(req.params.id)
    /*根据卡号找到数据库中所有关于该卡号的所有集合的记录*/
    const number = result.number
    /*删除定期存款明细中的记录*/
    await DepositFixed.remove({number})
    /*删除活期存款明细中的记录*/
    await DepositCurrent.remove({number})
    /*删除活期取款明细中的记录*/
    await DrawFixed.remove({number})

    res.send({
      success: true
    })
  })
  // 修改用户页面之后提交，同时更新数据库中的数据
  AccountRouter.put('/account/edit/:id',async (req,res) => {
    const modelID = await Account.findByIdAndUpdate(req.params.id,req.body)
    res.send(modelID)
  })
  // 获取对应 ID 的用户信息，并自动填写到编辑页面
  AccountRouter.get(`/account/edit/:id`,async (req,res) => {
    const modelEditId = await Account.findById(req.params.id)
    res.send(modelEditId)
  })

  app.use('/bank/admin/api',AccountRouter)
}