/**
 * 包含 n 个接口请求函数的模块
   每个函数返回 promise
 */
import jsonp from 'jsonp'

import ajax from './ajax'
import { message } from 'antd'

// const BASE = 'http://localhost:5000'
const BASE = '/api'

// 1). 登陆
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')

// 2). 添加或更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE +'/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

// 3). 更新用户
// export const reqUpdataUser = (user) => ajax(BASE +'/manage/user/updata', user, 'POST')

// 4). 获取所有用户列表
export const reqUsers = () => ajax(BASE +'/manage/user/list')

// 5). 删除用户
export const reqDeleteUser = (userId) => ajax(BASE +'/manage/user/delete', {userId}, 'POST')

// 6). 获取一级或某个二级分类列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

// 7). 添加分类
export const reqAddCategory = (parentId, categoryName) => ajax(BASE + '/manage/category/add', {parentId, categoryName}, 'POST')

// 8). 更新品类名称
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

// 9). 根据分类ID获取分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})

// 10). 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})

// 11). 根据ID/Name搜索产品分页列表
// searchType: 搜索的类型， productName / productDesc
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search',{
  pageNum, 
  pageSize,
  [searchType]: searchName
})

// 12). 添加商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

// 13). 更新商品
// export const reqUpdateProduct = (product) => ajax(BASE + '/manage/product/update', {product}, 'POST')

// 14). 对商品进行上架/下架处理
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')

// 15). 上传图片
export const reqUploadImg = (image) => ajax(BASE + '/manage/img/upload', {image}, 'POST')

// 16). 删除图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

// 17). 添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')

// 18). 获取角色列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')

// 19). 更新角色(给角色设置权限)
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')

// 20). 获取天气信息(支持jsonp)
// jsonp请求的接口函数
export const reqWeather = (city) => {
  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url, {}, (err, data) => {
      if (!err && data.status === 'success') {
        const {weather, dayPictureUrl} = data.results[0].weather_data[0]
        resolve({weather, dayPictureUrl})
      } else {
        message.error('获取天气失败！')
      }
    })
  })

}