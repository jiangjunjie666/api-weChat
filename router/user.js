//user路由
const express = require('express')
const router = express.Router()

//导入处理函数
const reuterHandler = require('../router_handler/user')

//登录用户
router.post('/login', reuterHandler.login)
//注册用户
router.post('/reguser', reuterHandler.reguser)
//加好友的接口
router.post('/addfriend', reuterHandler.addfriend)
module.exports = router
