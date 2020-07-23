/*
* 所有关于 用户登录注册 的相关路由
* */
module.exports = app => {
  const express = require('express')
  const UserRouter = express.Router()
  const jwt = require('jsonwebtoken')
  const User = require('../models/User')
  const DepositFixed = require('../models/DepositFixed')
  const DepositCurrent = require('../models/DepositCurrent')
  const DrawFixed = require('../models/DrawFixed')
  const Account = require('../models/Account')

  // 接受用户的 登录信息
  UserRouter.post('/login',async (req,res) => {
    const {password,email} = req.body
    // 验证邮箱
    const userEmail = await User.findOne({email})
    if(!userEmail){
      return res.send({
        messageCode: -1 //用户不存在
      })
    }else{
      // 验证密码
      const userPass = await User.findOne({password})
      if(!userPass){
        return res.send({
          messageCode: -2 // 密码错误
        })
      }
      // 用户存在，且密码正确，生成token
      const token = jwt.sign({ id: userEmail._id },app.get('secret'))
      res.send({
        messageCode: 0,
        token: token,  //向客户端返回生成的token信息
        username:userEmail.username,
        password:userPass.password,
        icon: userEmail.icon,
        email: userEmail.email,
        radio: userEmail.radio
      })
    }

  })

  // 接受用户的 注册信息 ，保存在数据库中
  UserRouter.post('/register',async (req,res) => {
    /*查找数据中是否存在该用户的信息，如果存在则不能注册*/
    const {email} = req.body
    const result = await User.find({email})
    if(result.length !== 0){   // 用户已存在，不能注册
      return res.send({messageCode:-1})
    }else{
      const user = User.create(req.body)
      res.send({
        messageCode:0,
        user:user.username,
        password:user.password,
      })
    }
  })

  // 图片上传接口
  const multer = require('multer')/*中间件，用于处理图片数据，express本身没有提供处理图片数据的功能*/
  const upload = multer({ dest:__dirname + '../../uploads' })
  UserRouter.post('/upload',upload.single('file'),async (req,res) => {
    const file = req.file
    /*手动拼出图片地址并返回给客户端*/
    file.url = `http://localhost:5000/uploads/${file.filename}`
    res.send(file)
  })

  // 修改个人信息
  UserRouter.put('/system/personal',async (req,res) => {
    /*根据token解析出对应用户 _id，然后修改该用户的信息*/
    const token = req.body.token
    const {id} = await jwt.verify(token,app.get('secret'))
    /*修改用户更改的信息*/
    const user = await User.findByIdAndUpdate(id,req.body)

    /*如果用户修改了邮箱或密码，必须重新登陆*/
    if(req.body.isEmail || req.body.isPass){
      return res.send({
        message: '要求重新登陆！'
      })
    }
    const result = await User.findById(id)
    res.send({
      icon: result.icon,
      username: result.username
    })
  })

  // 获取对应 id的用户记录
  UserRouter.get('/system/personal',async (req,res) => {
    const token = await req.query['0']
    const userId = await jwt.verify(token,app.get('secret')).id
    const user = await User.findById(userId)
    res.send(user)
  })
  //注销账号
  UserRouter.delete('/user/:token',async (req,res) => {
    /*获取 该用户的 token 信息*/
    const token = await req.params.token.slice(1)
    console.log('token:'+token);
    /*根据 token信息获取到该用户的 id*/
    const userId = await jwt.verify(token,app.get('secret')).id
    console.log('userId:'+userId);
    /*同时删除该用户的所有存款、取款、开户、回收站等明细信息*/
    // 根据用户 id 获取到该用户的姓名username
    const aa = await User.findById(userId)
    console.log('aa:'+aa);
    await DepositFixed.remove({name:aa.username})
    await DepositCurrent.remove({name:aa.username})
    await DrawFixed.remove({name:aa.username})
    await Account.remove({name:aa.username})
    /*删除该用户的  用户 信息*/
    const removeUser = await User.findByIdAndRemove(userId)
    res.send({
      success: true
    })
  })

  app.use('/bank/admin/api',UserRouter)
}