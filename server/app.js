//加载 express模块
const express = require('express')
const mongoose = require('mongoose')
//注册 express实例
const app = express()
//设置生成token的算法
app.set('secret','BankSystem')
//解决跨域问题
app.use(require('cors')())
//使用post请求的req.body
app.use(express.json())
// 开放后台保存图片的文件夹地址
app.use('/uploads',express.static(__dirname+'/uploads'))
mongoose.set('useFindAndModify', false)

//引入数据库
require('./dataBase/db')(app)
//引入所有account相关的路由
require('./routes/User')(app)
require('./routes/Account')(app)
require('./routes/DepositFixed')(app)
require('./routes/DepositCurrent')(app)
require('./routes/DrawFixed')(app)
require('./routes/Recycle')(app)
//启动路由器
app.listen(5000, () => {
  console.log('Bank System is running...');
})