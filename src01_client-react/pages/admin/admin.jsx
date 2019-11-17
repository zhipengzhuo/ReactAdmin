/*
 * 管理的路由组件
 */

import React, {Component} from 'react'
import {Redirect, Switch, Route} from 'react-router-dom'
import { Layout } from 'antd'

import memoryUtils from '../../utils/memoryUtils'
import Header from '../../components/header'
import LeftNav from '../../components/left-nav'

import Home from '../home/home'
import Product from '../product/product'
import Category from '../category/category'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'



const { Footer, Sider, Content } = Layout

export default class Admin extends Component {
  
  render () {
    const user = memoryUtils.user
    // 如果内存中没有存储user ==> 当前没有登陆
    if (!user || !user._id) {
      // 自动跳转到登陆界面（在render()中）
      return <Redirect to= '/login'/>
    } 
    return (
      <Layout style={{minHeight: '100%'}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{margin: 20 ,backgroundColor: '#fff'}}>
            <Switch>
              <Redirect from='/' exact to='/home'/>
              <Route path='/home' component={Home} />
              <Route path='/product' component={Product} />
              <Route path='/category' component={Category} />
              <Route path='/user' component={User} />
              <Route path='/role' component={Role} />
              <Route path='/charts/line' component={Line} />
              <Route path='/charts/bar' component={Bar} />
              <Route path='/charts/pie' component={Pie} />
            </Switch>
          </Content>
          <Footer style={{textAlign: 'center', color: '#ccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}