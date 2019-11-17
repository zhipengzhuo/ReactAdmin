// 头部组件

import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'


import './index.less'
import {formateDate} from '../../utils/dateUtils'
import {reqWeather} from '../../api'
import menuList from '../../config/menuConfig'
import LinkButton from '../link-button'
import {logout} from '../../redux//actions'

class Header extends Component {
  static propTypes = {
    headTitle: PropTypes.string.isRequired
  }

  state = {
    currentTime: formateDate(Date.now()), // 当前时间
    dayPictureUrl: '', // 天气图片
    weather: '' // 天气文本
  }
  
  getTime = () => {
    this.intervalId = setInterval(() => {
      // 获取当前时间
      const {currentTime} = this.state
      // 更新时间
      this.setState({currentTime})
    }, 1000)
  }

  getWeather = async () => {
    // 发送ajax请求,获取天气数据
    const {dayPictureUrl, weather} = await reqWeather('广州')
    // 更新天气状态
    this.setState({dayPictureUrl, weather})
  }
  
  // 获取title
  getTitle = () => {
    // 得到当前的path
    const path = this.props.location.pathname
    // 从menuList得到与path相同的title,并取出来
    let title
    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title
      } else if (item.children) {
        const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
        if (cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }

  // 退出登陆
  logout = () => {
    //  弹出确认框
    Modal.confirm({
      content: '确认退出吗？',
      onOk:() => {
        // 
        this.props.logout()
        // 跳转到login界面
        this.props.history.replace('/login')
      }
    })
  }


  componentDidMount () {
    // 获取当前时间
    this.getTime()
    // 异步获取当前天气
    this.getWeather()
  }

  // 当前组件卸载之前调用
  componentWillUnmount () {
    // 清除定时器
    clearInterval(this.intervalId)
  }

  render () {

    const {currentTime, dayPictureUrl, weather} = this.state
    const username = this.props.user.username
    // const title = this.getTitle()
    const title = this.props.headTitle

    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">
            {title}
          </div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="weather"/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({headTitle: state.headTitle, user: state.user}),
  {logout}
)(withRouter(Header))