//导入数据库操作模块
const db = require('../dbMysql/index')

exports.login = (req, res) => {
  //用户登录
  const data = req.body
  console.log(data)
  if (!data.username || !data.password) {
    return res.send({
      code: 0,
      message: '用户名或者密码不合法'
    })
  }
  const selectSql = 'select * from user where username = ?'
  db.query(selectSql, data.username, (err, result) => {
    if (err) {
      return res.send({
        code: 0,
        message: '服务器错误'
      })
    }
    console.log(result)
    if (result[0].password !== data.password) {
      return res.send({
        code: 0,
        message: '密码错误'
      })
    }
    if (data.password === result[0].password) {
      //用户存在，密码正确
      return res.send({
        code: 1,
        data: result[0]
      })
    }
  })
}

exports.reguser = (req, res) => {
  //注册用户
  //首先拿到表单数据
  const data = req.body
  console.log(data)
  if (!data.username || !data.password) {
    return res.send({
      code: 0,
      message: '用户名或者密码不合法'
    })
  }
  const selectSql = 'select * from user where username=?'
  db.query(selectSql, data.username, (err, results) => {
    if (err) {
      return res.send({
        code: 0,
        message: '数据库错误'
      })
    }
    if (results.length > 0) {
      return res.send({
        code: 0,
        message: '用户名已存在'
      })
    }
    //用户名可用
    const insertSql = 'insert into user set ?'
    db.query(insertSql, { username: data.username, password: data.password, avatar: 'avatar', create_date: '2023-09-15' }, (err, results) => {
      if (err) {
        console.log(err)
        return res.send({
          code: 0,
          message: '数据库错误'
        })
      }
      if (results.affectedRows !== 1) {
        return res.send({
          code: 0,
          message: '注册失败'
        })
      }
      res.send({
        code: 1,
        message: '注册成功'
      })
    })
  })
}
