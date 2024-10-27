/**
 * electron 的主进程
 */
// 导入模块
import {
  /** 应用程序 */
  app,
  /** 窗口 */
  BrowserWindow,
  /** 全局快捷键 */
  globalShortcut,
  /** IPC（进程间通信）模块，用于在渲染进程和主进程间通信 */
  ipcMain
} from 'electron'
/** 导入Node.js内置的process模块，用于访问环境变量和系统信息 */
import process from 'process'
// 导入node.js内置的path模块，用于处理和操作文件路径
import path from 'path'
// 导入os模块，用于访问Node.js的操作系统相关功能
import os from 'os'
/** 导入服务 */
import server from './server/server.ts'

/** 服务端口 */
let serverPort = 3000
/** 启动服务 */
server.launch(serverPort)
/**
 * 创建主窗口
 */
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 根据是否存在开发路径，决定加载开发环境的路径 or 生产环境的包
  const devUrl = process.argv[2]
  if(devUrl){
    win.loadURL(devUrl)
  }else{
    // 这个 pages/index.html 就是 vue3 打包之后的那个 index.html
    win.loadFile(path.resolve(__dirname,'pages/index.html'))
  }
  // 全局快捷键 开启调试工具
  globalShortcut.register('CommandOrControl+Shift+i', function () {
    win.webContents.openDevTools()
  })
}

// 应用准备就绪，加载窗口
app.whenReady().then(() => {

  console.log('electronMain.js : ready')

    createWindow()

    // mac 上默认保留一个窗口
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

  console.log('--- 程序就绪 ---')
})

// 关闭所有窗口 ： 程序退出 ： windows & linux
app.on('window-all-closed', () => {
  console.log('--- 程序退出 ---')
  if (os.type() !== 'Darwin') app.quit()
})

// 监听渲染进程发送的消息
ipcMain.handle('sendRequest', async (event, url, arg) => {
  // 协议
  let protocol = arg.protocol || 'http'
  // 服务地址
  let hostname = arg.hostname || `localhost:${serverPort}`
  // 将请求转发给服务
  let res = await fetch(`${protocol}://${hostname}/${url}`, arg)
  // 成功获取数据 失败获取错误信息
  let data = await res.json()
  data.ok = res.ok
  data.status = res.status
  return data
})
