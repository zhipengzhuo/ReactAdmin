/*
 *登陆的路由组件 
 */
import React, {Component} from 'react'
import { Form, Icon, Input, Button, message } from 'antd'
import {Redirect} from 'react-router-dom'

import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtil from '../../utils/storageUtil'

class Login extends Component {

  handleSubmit = (event) => {
    // 阻止表单的默认行为
    event.preventDefault()
    // 对所有表单字段进行检验
    this.props.form.validateFields(async (err, values) => {
      // 校验成功
      if (!err) {
        // console.log('提交登陆的ajax请求 ', values)
        // 请求登陆
        const {username, password} = values
        const result = await reqLogin(username, password)
        if (result.status === 0) { // 登陆成功
          // 提示登陆成功
          message.success('登陆成功')
          // 保存user
          const user = result.data
          memoryUtils.user = user // 保存到内存中
          storageUtil.saveUser(user) // 保存到local中
          // 跳转到后台管理界面(不需要回退回来)
          this.props.history.replace('/')

        } else { // 登陆失败
          // 提示错误信息
          message.error(result.msg)
        }
      } else {
        console.log('校验失败!')
      }
    })
  }

  // 对密码进行自定义验证
  validatorPwd = (rule, value, callback) => {
    if (!value) {
      callback('密码必须输入')
    } else if (value.length < 4) {
      callback('密码长度必须大于4位')
    } else if (value.length > 12) {
      callback('密码长度必须小于12位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须是英文，数字或者下划线组成')
    } else {
      callback() // 验证通过
    }
    // console.log('validatorPwd', rule, value)
    // callback('xxxx') // 验证失败并指定提示的文本
  }

  render () {
    // 如果用户已经登陆，自动跳转到管理界面
    const user = memoryUtils.user
    if (user && user._id) {
      return <Redirect to='/'/>
    }
    // 得到具有强大功能的form
    const {form} = this.props
    const {getFieldDecorator} = form 
    return (
      <div className="login"> 
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登陆</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {
                getFieldDecorator('username', { // 配置对象：属性名是一些特定的名称
                  // 声明式验证：直接使用别人定义好的验证规则进行验证
                  rules: [
                    {required: true, whitespace: true, message: '用户名必须输入'},
                    {min: 4 , message: '用户名至少4位'},
                    {max: 12, message: '用户名至多12位'},
                    {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文，数字或者下划线组成'}
                  ],
                  initialValue: 'admin'
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Username"
                  />
                )
              }
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator('password',{
                  rules: [
                    {
                      validator: this.validatorPwd
                    }
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />
                )
              }
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登陆
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}
// 包装Form组件，生成一个新的组件：
//  新组件会向Form组件传递一个强大的对象属性： form
const WrappLogin = Form.create()(Login)
export default WrappLogin