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
    // console.log('开户表中的对应卡号信息：'+result); // 返回一个对象，只有一个查找结果，因为开户表中的信息都是唯一的
    if(result.length === 0){
      return res.send('卡号不存在！')
    }else{
      /*找到对应卡号中是否存在定期存款，如果存在，则余额应该排除定期存款金额（冻结金额）*/
      // console.log('卡号：'+number);

      let newBalance
      let fixedMoney = 0
      let balanceMeg
      /*查找对应卡号中的所有定期存款信息记录，如果存在，则说明有冻结资金*/
      const depositItem = await DepositFixed.find({number:number})
      console.log('所有的冻结信息：'+ Object.keys(depositItem));
      // console.log('第一个'+ depositItem[0]);
      // console.log('第二个'+ depositItem[1]);

      if(Object.keys(depositItem).length === 0){     // 没有冻结的定期存款资金
        /*由于取款，所以修改 开户表 中的余额 = 原余额 - 取款金额*/
        newBalance = parseFloat(result[0].balance) - parseFloat(req.body.money)
        fixedMoney = 0    // 由于没有定期存款操作，所以冻结资金为0元
        balanceMeg = parseFloat(result[0].balance)  // 取款之前的余额
      }else{      // 有冻结的定期存款资金
        /*冻结资金*/
        // fixedMoney = parseFloat(depositItem[0].money)   // 冻结资金
        for (let i = 0; i < Object.keys(depositItem).length; i++) {
          fixedMoney += parseFloat(depositItem[i].money)
        }
        console.log('所有的冻结资金：'+fixedMoney);
        /*取款之前可取出的余额 = 原来的余额 - 冻结资金*/
        // console.log('***'+ result[0].balance);
        balanceMeg = parseFloat(result[0].balance) - fixedMoney  // 可取款之前的余额
        console.log('balanceMeg:'+balanceMeg);

        /*可取款之后剩余的余额 = 原来的总余额 - 用户需要取款的金额 */
        newBalance = balanceMeg - parseFloat(req.body.money)
        console.log('newBalance:'+newBalance);

        // newBalance = parseFloat(result[0].balance) - parseFloat(depositItem[0].money) - parseFloat(req.body.money)


        // balanceMeg = parseFloat(result[0].balance) - parseFloat(depositItem[0].money)  // 取款之前的余额
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
        await Account.update({number},{$set:{"balance": newBalance + fixedMoney}})
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
    let modelItems
    if(req.query.radio === '管理员'){
      modelItems = await DrawFixed.find({del:false})
      return res.send(modelItems)
    }else{
      /*获取前台传递过来的当前用户*/
      const name = await req.query.username
      /*根据当前用户找到数据库中所有关于该用户的开户信息*/
      modelItems = await DrawFixed.find({name:name,del:false})
      res.send(modelItems)
    }
  })
  // 删除指定 id 对应存款记录
  DrawFixedRouter.delete('/draw/:id',async (req,res) => {
    /*根据ID找到对应存款信息*/
    const ans = await DrawFixed.findById(req.params.id)
    /*获取该条存款信息记录的id号*/
    const userId = await ans._id
    /*将该改用信息记录的del字段设置为true，表示放入回收站*/
    await DrawFixed.updateOne({_id:userId},{$set:{"del": true}})
    // const result = await DepositFixed.findById(userId)
    // console.log(result);
    res.send({
      success: true
    })
  })

  app.use('/bank/admin/api',DrawFixedRouter)
}