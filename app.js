const express = require('express')

const app = express()

//配置跨域
const cors = require('cors')
app.use(cors())
//配置静态资源
app.use(express.static(__dirname + '/public'))
//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false })) //请求时需要加上请求头：application/x-www-form-urlencoded

//导入user路由
const userRouter = require('./router/user.js')
app.use('/user', userRouter)
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
