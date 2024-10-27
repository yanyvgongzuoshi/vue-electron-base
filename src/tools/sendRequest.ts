import { type Plugin, type App } from 'vue'

declare type SendRequestConfig = {
    method: string
    headers: object
    body: object | string | undefined
}
declare type SendRequestResponse = {}

const defaultConfig: SendRequestConfig = {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: {}
}
/**
 * 合并配置对象
 * 递归地将源对象(source)合并到目标对象(target)中
 * 如果目标对象中存在相同的属性名，则会被源对象的属性值覆盖
 * @param target 目标对象，将被合并的对象
 * @param source 源对象，合并的来源对象
 * @returns 返回合并后的目标对象
 */
function mergeConfig(target: any, source: any) {
    const result = JSON.parse(JSON.stringify(target));
    // 遍历源对象的所有属性
    for (const key in source) {
        // 尝试访问源对象的属性值
        try {
            // 如果属性值是对象，则递归调用MergeConfig函数进行深度合并
            if (source[key].constructor == Object) {
                result[key] = mergeConfig(result[key], source[key]);
            } else {
                // 如果属性值不是对象，则直接覆盖目标对象的属性值
                result[key] = source[key];
            }
        } catch (e) {
            // 如果目标对象没有该属性，则创建该属性并设置其值
            result[key] = source[key];
        }
    }
    return result;
}

const sendRequest: Plugin<[]> = {
    install(app: App, options?: any) {
        /** electron方式发送请求 */
        const electronSendRequest: (
            url: string,
            config: SendRequestConfig
        ) => Promise<SendRequestResponse> = (url: string, config: SendRequestConfig) => {
            const configObj: SendRequestConfig = mergeConfig(defaultConfig, config)
            // 如果是object类型，需要转换为json字符串
            if (config.body && typeof config.body === 'object') {
                configObj.body = JSON.stringify(configObj.body)
            }
            // GET和HEAD请求不需要body
            if (configObj.method.toUpperCase() === 'GET' || configObj.method.toUpperCase() === 'HEAD') {
                delete configObj.body
            }
            // @ts-ignore
            return options.electron.sendRequest(url, configObj)
        }
        /** TODO fetch方式发送请求 */
        const fetchSendRequest: (
            url: string,
            config: SendRequestConfig
        ) => Promise<SendRequestResponse> = async (url: string, config: SendRequestConfig) => {
            const response: SendRequestResponse = {}
            return response
        }

        // 注入一个全局可用的 $sendRequest() 方法
        if (options.electron) {
            console.log('方法已注入')
            app.config.globalProperties.$sendRequest = electronSendRequest
        } else {
            app.config.globalProperties.$sendRequest = fetchSendRequest
        }
    }
}

export default sendRequest
