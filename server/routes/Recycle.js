/*
* 所有关于回收站的路由
*
* */
module.exports = app => {
  const express = require('express')
  const RecycleRouter = express.Router()
  const DepositFixed = require('../models/DepositFixed')
  const DepositCurrent = require('../models/DepositCurrent')
  const DrawFixed = require('../models/DrawFixed')

  // 请求数据库中的所有开户信息
  RecycleRouter.get('/recycle',async (req,res) => {
    let items1
    let items2
    let items3
    if(req.query.radio === '管理员'){
      items1 = await DrawFixed.find({del: true})
      items2 = await DepositFixed.find({del: true})
      items3 = await DepositCurrent.find({del: true})

      // modelItems = await DepositFixed.find({del: true})
      console.log('item1'+items1);
      console.log('item2'+items2);
      console.log('item3'+items3);
      return res.send({
        items1: items1,
        items2: items2,
        items3: items3,
      })
    }else{
      /*获取前台传递过来的当前用户*/
      const name = await req.query.username
      /*根据当前用户找到数据库中所有关于该用户的开户信息*/
      items1 = await DrawFixed.find({name:name,del: true})
      items2 = await DepositFixed.find({name:name,del: true})
      items3 = await DepositCurrent.find({name:name,del: true})
      // modelItems = await DepositFixed.find({name},{del: true})
      return res.send({
        items1: items1,
        items2: items2,
        items3: items3,
      })
    }
  })

  RecycleRouter.get('/recycle/pagination/1',async (req,res) => {
    let items1
    let items2
    let items3
    if(req.query.radio === '用户'){
      const name = await req.query.username
      /*根据当前用户找到数据库中所有关于该用户的开户信息*/
      items1 = await DrawFixed.find({name:name,del: true}).limit(5)
      items2 = await DepositFixed.find({name:name,del: true}).limit(5)
      items3 = await DepositCurrent.find({name:name,del: true}).limit(5)
    }else{
      items1 = await DrawFixed.find().limit(5)
      items2 = await DepositFixed.find().limit(5)
      items3 = await DepositCurrent.find().limit(5)
    }
    return res.send({
      items1: items1,
      items2: items2,
      items3: items3,
    })
  })
  RecycleRouter.get('/recycle/pagination/2',async (req,res) => {
    let items1
    let items2
    let items3
    if(req.query.radio === '用户'){
      const name = await req.query.username
      /*根据当前用户找到数据库中所有关于该用户的开户信息*/
      items1 = await DrawFixed.find({name:name,del: true}).limit(5).skip(5 * 1)
      items2 = await DepositFixed.find({name:name,del: true}).limit(5).skip(5 * 1)
      items3 = await DepositCurrent.find({name:name,del: true}).limit(5).skip(5 * 1)
    }else{
      items1 = await DrawFixed.find().limit(5).skip(5 * 1)
      items2 = await DepositFixed.find().limit(5).skip(5 * 1)
      items3 = await DepositCurrent.find().limit(5).skip(5 * 1)
    }
    return res.send({
      items1: items1,
      items2: items2,
      items3: items3,
    })
  })
  RecycleRouter.get('/recycle/pagination/3',async (req,res) => {
    let items1
    let items2
    let items3
    if(req.query.radio === '用户'){
      const name = await req.query.username
      /*根据当前用户找到数据库中所有关于该用户的开户信息*/
      items1 = await DrawFixed.find({name:name,del: true}).limit(5).skip(5 * 2)
      items2 = await DepositFixed.find({name:name,del: true}).limit(5).skip(5 * 2)
      items3 = await DepositCurrent.find({name:name,del: true}).limit(5).skip(5 * 2)
    }else{
      items1 = await DrawFixed.find().limit(5).skip(5 * 2)
      items2 = await DepositFixed.find().limit(5).skip(5 * 2)
      items3 = await DepositCurrent.find().limit(5).skip(5 * 2)
    }
    return res.send({
      items1: items1,
      items2: items2,
      items3: items3,
    })
  })
  RecycleRouter.get('/recycle/pagination/4',async (req,res) => {
    let items1
    let items2
    let items3
    if(req.query.radio === '用户'){
      const name = await req.query.username
      /*根据当前用户找到数据库中所有关于该用户的开户信息*/
      items1 = await DrawFixed.find({name:name,del: true}).limit(5).skip(5 * 3)
      items2 = await DepositFixed.find({name:name,del: true}).limit(5).skip(5 * 3)
      items3 = await DepositCurrent.find({name:name,del: true}).limit(5).skip(5 * 3)
    }else{
      items1 = await DrawFixed.find().limit(5).skip(5 * 3)
      items2 = await DepositFixed.find().limit(5).skip(5 * 3)
      items3 = await DepositCurrent.find().limit(5).skip(5 * 3)
    }
    return res.send({
      items1: items1,
      items2: items2,
      items3: items3,
    })
  })
  RecycleRouter.get('/recycle/pagination/5',async (req,res) => {
    let items1
    let items2
    let items3
    if(req.query.radio === '用户'){
      const name = await req.query.username
      /*根据当前用户找到数据库中所有关于该用户的开户信息*/
      items1 = await DrawFixed.find({name:name,del: true}).limit(5).skip(5 * 4)
      items2 = await DepositFixed.find({name:name,del: true}).limit(5).skip(5 * 4)
      items3 = await DepositCurrent.find({name:name,del: true}).limit(5).skip(5 * 4)
    }else{
      items1 = await DrawFixed.find().limit(5).skip(5 * 4)
      items2 = await DepositFixed.find().limit(5).skip(5 * 4)
      items3 = await DepositCurrent.find().limit(5).skip(5 * 4)
    }
    return res.send({
      items1: items1,
      items2: items2,
      items3: items3,
    })
  })
















  // 真正的删除数据库中的对应 ID 的信息记录
  RecycleRouter.delete('/recycle/:id',async (req,res) => {
    let items1
    let items2
    let items3
    items1 = await DrawFixed.findByIdAndRemove(req.params.id)
    items2 = await DepositFixed.findByIdAndRemove(req.params.id)
    items3 = await DepositCurrent.findByIdAndRemove(req.params.id)

    res.send({
      items1: items1,
      items2: items2,
      items3: items3,
    })
  })

  // 恢复回收站中的信息记录
  RecycleRouter.get('/recycle/:id',async (req,res) => {
    // 根据id恢复删除记录。即将该id对应的信息记录字段的del：false，即可
    let items1
    let items2
    let items3
    items1 = await DrawFixed.updateOne({_id:req.params.id},{$set:{"del": false}})
    items2 = await DepositFixed.updateOne({_id:req.params.id},{$set:{"del": false}})
    items3 = await DepositCurrent.updateOne({_id:req.params.id},{$set:{"del": false}})

    res.send({
      items1: items1,
      items2: items2,
      items3: items3,
    })
  })


  app.use('/bank/admin/api',RecycleRouter)
}