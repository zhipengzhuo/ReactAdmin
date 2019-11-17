/**
 * 发送ajax异步请求的模块
 * 封装axios库
 * 返回值是promise对象
 * 1. 优化1：
 *    统一处理请求异常
 *    在外层包一个足迹创建的promise对象
 *    在请求出错时，不去reject(error), 而是显示错误提示
 * 
 * 2. 优化2:异步得到的不是response,而是response.data
 *    在请求成功resolve时，resolve（response.data）
 */
import axios from 'axios'
import {message} from 'antd'

export default function ajax(url, data={}, type='GET') {
  return new Promise((resolve, reject) => {
    let promise
    // 1. 执行异步ajax请求
    if(type === 'GET') { // 发GET请求
      promise = axios.get(url, { // 配置对象
        params: data // 指定请求参数
      })
    } else { // 发POST请求
      promise = axios.post(url, data)
    }
    promise.then(response => {
      // 2. 如果成功了，调用resolve(value)
      resolve(response.data)
    }).catch(error => {
      // 3. 如果失败了，不调用reject(reason)，而是提示异常信息
      message.error('请求出错了' + error.message)
    })
  })

}

/*
export default function ajax(url, data={}, type='GET') {
  return new Promise((resolve, reject) => {
    let promise

    if (type === 'GET') {
      // 准备url query参数数据
      let dataStr = '' // 数据拼接字符串
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = url + '?' + dataStr
      }
      // 发送get请求
      promise = axios.get(url) // axios返回一个promise对象
    } else {
      // 发送post请求
      promise = axios.post(url, data)
    }

    promise.then(response => {
      // 成功了调用resolve()
      resolve(response.data)
    }).catch(error => {
      // 失败了调用reject()
      reject(error)
    })
  })
}
*/