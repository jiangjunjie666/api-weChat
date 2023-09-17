//导入数据库操作模块
const db = require('../dbMysql/index')

//查找用户信息
exports.getUserInfo = (req, res) => {
  //拿到username
  const username = req.query.username
  //查询数据库
  const sql = 'select * from user where username=?'
  db.query(sql, username, (err, results) => {
    if (err) {
      return res.send({
        code: 0,
        message: '数据库错误'
      })
    }
    if (results.length === 0) {
      return res.send({
        code: 0,
        message: '用户不存在'
      })
    }
    res.send({
      code: 1,
      data: results[0]
    })
  })
}
//拿到所有好友信息
exports.getUserFriends = (req, res) => {
  //传入一个数组的字符串吧
  const username = req.query.firendsName
  console.log(username)
  //查询数据库,解析字符串为数组
  const arr = username.match(/"(.*?)"/g).map((item) => item.replace(/"/g, ''))
  console.log(arr)
  //遍历查询数据库
  const sql = 'select * from user where username=?'
  const promises = []

  for (let i = 0; i < arr.length; i++) {
    const promise = new Promise((resolve, reject) => {
      db.query(sql, arr[i], (err, results) => {
        if (err) {
          reject(err)
        } else {
          results[0].user_firends = results[0].user_firends.match(/"(.*?)"/g).map((item) => item.replace(/"/g, ''))
          resolve(results[0])
        }
      })
    })
    promises.push(promise)
  }

  Promise.all(promises)
    .then((data) => {
      res.send({
        code: 1,
        data: data
      })
    })
    .catch((err) => {
      res.send({
        code: 0,
        message: '数据库错误'
      })
    })
}
