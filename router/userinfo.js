//userinfo路由
const express = require('express')
const router = express.Router()

//导入处理函数
const reuterInfoHandler = require('../router_handler/userinfo')

//路由函数

//拿到用户的信息，需要携带用户的username参数
router.get('/userinfo', reuterInfoHandler.getUserInfo)
//拿到所有的好友信息
router.get('/userfriends', reuterInfoHandler.getUserFriends)
module.exports = router
