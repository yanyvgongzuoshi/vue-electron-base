import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import fileUtils from '../utils/file.ts'

type ErrorResponse = { message: any; timestamp: string; path: any; stack?: any }

const app = express()
// 解析json参数
app.use(bodyParser.json())
// 解析url参数
app.use(bodyParser.urlencoded({ extended: false }))

// 获取./action下所有的文件路径
const actionsPath = path.join(__dirname, 'server', 'action')
let actions: Array<string> = fileUtils.getAllFilePaths(actionsPath);

(async () => {
  for (let action of actions) {
    // 遍历文件路径，向服务中添加接口
    const module = await import(`file://${action.replaceAll('%', '%25')}`)

    // 替换字符串，获取实际接口地址
    const api = action.replace(actionsPath, '').replaceAll('\\', '/').replace('.js', '').replaceAll('%3A', ':')
    // 遍历module，向服务中添加接口
    for (let key in module) {
      if (key === 'default') continue
      app[key](api, async (req, res) => {
        // 包装一层，捕获异步异常
        try {
          await module[key](req, res)
        } catch (err) {
          // 设置响应状态码
          res.status(err.status || 500);

          // 根据环境（开发或生产）返回不同的错误信息
          const isProduction = process.env.NODE_ENV === 'production';

          // 构建错误响应对象
          const errorResponse: ErrorResponse = {
            message: err.message,
            timestamp: new Date().toISOString(),
            path: req.path
          };

          // 如果不是生产环境，添加堆栈信息
          if (!isProduction) {
            errorResponse.stack = err.stack;
          }

          // 返回 JSON 格式的错误信息
          res.send(errorResponse);
        } finally {
        }
      })
    }
  }
})().then(() => {
  // 404 处理
  // 所有路由定义完之后，最后做404处理 /
  app.all('*', function (req, res) {
    // 设置响应状态码
    res.status(404)
    res.send({})
  })

  // 错误处理中间件
  app.use(function (err, req, res, next) {
    // 设置响应状态码
    res.status(err.status || 500);

    // 根据环境（开发或生产）返回不同的错误信息
    const isProduction = process.env.NODE_ENV === 'production';

    // 构建错误响应对象
    const errorResponse: ErrorResponse = {
      message: err.message,
      timestamp: new Date().toISOString(),
      path: req.path
    };

    // 如果不是生产环境，添加堆栈信息
    if (!isProduction) {
      errorResponse.stack = err.stack;
    }

    // 返回 JSON 格式的错误信息
    res.send(errorResponse);
  });
})



/** 启动服务 */
const launch = (port) => {
  app.listen(port, () => {
    console.log(`express : 服务已于${port}端口启动`)
  })
}

export default {
  launch
}