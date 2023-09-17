//编写一个函数，用来在加完好友后加对方的好友
//导入数据库操作模块
const db = require('../dbMysql/index')

const addFriend = (username, firUsername) => {
  // 首先，从数据库中获取当前的user_friends值
  const selectSql = 'SELECT user_firends FROM user WHERE username = ?'
  db.query(selectSql, username, (err, results) => {})
}

//将函数导出使用
export default addFriend
