/*
 *登陆的路由组件 
 */
import React, {Component} from 'react'
import { Form, Icon, Input, Button, message } from 'antd'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import {login} from '../../redux/actions'
import './login.less'
import logo from '../../assets/images/logo.png'


class Login extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired
  }

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
        // 调用分发异步action的函数 => 发登陆的异步请求，有了结果后更新状态
        this.props.login(username, password)
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
    const user = this.props.user
    console.log(' render () ', user)
    if (user && user._id) {
      return <Redirect to='/home'/>
    }
    const errorMsg = this.props.user.errorMsg
    console.log(errorMsg)

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
          <div  className={user.errorMsg ? 'error-msg show' :'error-msg'}>{errorMsg}</div>
          <h2 >用户登陆</h2>
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
export default connect(
  state => ({user: state.user}),
  {login}
)(WrappLogin) 