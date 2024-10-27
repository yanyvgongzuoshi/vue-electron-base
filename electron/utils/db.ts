import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

// 创建数据库
class Db {
  // 每个数据库对应一个连接对象，实现单例
  static dbMap = new Map()
  constructor() {
  }
  /** 获取数据库连接实例 */
  static getInstance(dbName) {
    let db = Db.dbMap.get(dbName)
    if (!db) {
      return new Promise((resolve, reject) => {
        open({
          filename: path.join('db', dbName),
          driver: sqlite3.Database
        }).then((db) => {
          Db.dbMap.set(dbName, db)
          resolve(db)
        })
      })
    }
    return db
  }
}

export default Db