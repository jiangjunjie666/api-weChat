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
      //将字段user_firends解析成数组
      result[0].user_firends = result[0].user_firends.match(/"(.*?)"/g).map((item) => item.replace(/"/g, ''))
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
//加好友
exports.addfriend = (req, res) => {
  //需要拿到好友的name，加好后需要新建一张与该好友的聊天记录表
  const data = req.body
  let len = 0
  //先查找看是否有此用户
  const sql = 'select * from user where username=?'
  db.query(sql, data.firendUsername, (err, results) => {
    if (err) {
      return res.send({
        code: 0,
        message: '数据库错误'
      })
    }
    len += results[0].id
    len += parseInt(data.len)
    if (results.length === 0) {
      return res.send({
        code: 0,
        message: '该用户不存在，不可加好友'
      })
    }
    // 首先，从数据库中获取当前的user_friends值
    const selectSql = 'SELECT user_firends FROM user WHERE username = ?'
    db.query(selectSql, data.username, (err, results) => {
      if (err) {
        return res.send({
          code: 0,
          message: '数据库错误'
        })
      }

      // 提取当前的user_friends值
      const currentFriends = JSON.parse(results[0].user_firends || '[]')
      // 检查user_friends数组中是否已包含新的好友
      if (currentFriends.includes(data.firendUsername)) {
        return res.send({
          code: 0,
          message: '该用户已经是好友了'
        })
      }

      // 将新的好友添加到user_friends数组中
      currentFriends.push(data.firendUsername)

      // 更新数据库中的user_friends字段
      const updateSql = 'UPDATE user SET user_firends = ? WHERE username = ?'
      db.query(updateSql, [JSON.stringify(currentFriends), data.username], (err, results) => {
        if (err) {
          console.log(err)
          return res.send({
            code: 0,
            message: '数据库错误'
          })
        }
        //这里直接做简化处理了，不用对方同意，直接互相加上好友
        db.query(selectSql, data.firendUsername, (err, results) => {
          if (err) {
            return res.send({
              code: 0,
              message: '数据库错误'
            })
          }
          // 提取当前的user_friends值
          const currentUserFriends = JSON.parse(results[0].user_firends || '[]')
          // len += results[0].id
          // 将新的好友添加到user_friends数组中
          currentUserFriends.push(data.username)
          db.query(updateSql, [JSON.stringify(currentUserFriends), data.firendUsername], (err, results) => {
            if (err) {
              console.log(err)
              return res.send({
                code: 0,
                message: '数据库错误'
              })
            }
            //这里应该创建一张属于他们俩的聊天记录表，其中包含自增的id，好友的id，和自己的id加起来
            const createSql = ` CREATE TABLE IF NOT EXISTS chat_history_${len} (
              id INT AUTO_INCREMENT PRIMARY KEY,
              chat_username VARCHAR(255) NOT NULL,
              chat_message TEXT NOT NULL
            );`
            //执行sql
            db.query(createSql, (err, results) => {
              if (err) {
                console.log(err)
                return res.send({
                  code: 0,
                  message: '数据库错误'
                })
              }
              res.send({
                code: 1,
                message: '好友添加成功'
              })
            })
          })
        })
      })
    })
  })
}
