import { contextBridge, ipcRenderer } from 'electron'

// 预加载文件 log不会显示 可访问node环境
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

/**
 * 前端调用发送请求方法调用electron接口
 */
const sendRequest = (url, config) => {
  return ipcRenderer.invoke('sendRequest', url, config)
}

// 标记为electron环境
contextBridge.exposeInMainWorld('electron', {
  // 将与主进程通信的方法暴露给渲染进程
  sendRequest
})
