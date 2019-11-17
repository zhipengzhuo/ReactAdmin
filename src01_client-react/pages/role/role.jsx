// 角色路由

import React, {Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'

import {PAGE_SIZE} from '../../utils/constants'
import {reqRoles, reqAddRole, reqUpdateRole} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import storageUtil from '../../utils/storageUtil'
import {formateDate} from '../../utils/dateUtils'

export default class Role extends Component {
  state = {
    roles : [], // 所有角色数组
    role: {}, // 选中的role
    isShowAdd: false, // 是否显示添加界面
    isShowAuth: false, // 是否显示设置权限界面
  }

  constructor(props) {
    super(props) 

    this.auth = React.createRef()
  }

  initColumn = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time) => formateDate(create_time)
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      }
    ]
  }
  onRow = (role) => {
    return {
      onClick: event => {
        // console.log('rowOnclick', role)
        this.setState({role})
      }
    }
  }

  getRoles = async () => {
    const result = await reqRoles()
    console.log(result)
    if (result.status === 0) {
      const roles = result.data
      this.setState({roles})
    }
  }

  // 添加角色
  addRole = () => {
    console.log('addRole', this.form)
    // 进行表单验证，只有通过了才继续
    this.form.validateFields(async (error, values) => {
      if (!error) {
        // 隐藏确认框
        this.setState({isShowAdd: false})
        // 收集输入数据
        const {roleName} = values
        // 清除表单输入
        this.form.resetFields()
        // 请求添加
        const result = await reqAddRole(roleName)
        // 根据结果提示/更新列表显示
        if (result.status === 0) {
          message.success('添加角色成功')
          // this.getRoles() 
          // 新产生的角色
          const role = result.data
          // 更新roles状态
          // const roles = this.state.roles
          // roles.push(role)
          // this.setState({roles})

          // 更新roles状态：基于原本的状态数据
          this.setState(state => ({
            roles: [...state.roles, role]
          }))

        } else {
          message.error('添加角色成功')
        }
      }
    })

  }

  // 更新角色
  updateRole = async () => {
    // 隐藏确认框
    this.setState({isShowAuth: false})
    const role = this.state.role
    // 得到最新的munus
    const menus = this.auth.current.getMenus()
    role.menus = menus
    role.auth_name = memoryUtils.user.username
    role.auth_time = Date.now()

    // 请求更新
    const result = await reqUpdateRole(role)
    if (result.status === 0) {
      
      // this.getRoles()
      // 如果当前更新的是自己角色的权限，强制退出
      if (role._id === memoryUtils.user.role_id) {
        memoryUtils.user = {}
        storageUtil.removeUser()
        this.props.history.replace('/login')
        message.success('当前用户角色权限修改了，请重新登陆！')
      } else {
        this.setState({
          roles: [...this.state.roles]
        })
      }
    } else {
      message.error('更新角色失败')
    }
    
  }

  componentWillMount () {
    this.initColumn()
  }
  
  componentDidMount () {
    this.getRoles()
  }

  render () {
    const {roles, role, isShowAdd, isShowAuth} = this.state

    const title = (
      <span>
        <Button type='primary' onClick={() => this.setState({isShowAdd: true})} >创建角色</Button>&nbsp;&nbsp;
        <Button type='primary' onClick={() => this.setState({isShowAuth: true})} disabled={!role._id}>设置角色权限</Button>
      </span>
    )

    return (
      <Card title={title}> 
        <Table
          bordered
          rowKey="_id"
          dataSource = {roles}
          columns = {this.columns}
          pagination = {{defaultPageSize: PAGE_SIZE}}
          rowSelection={{
            type: 'radio', 
            selectedRowKeys: [role._id],
            onSelect: (role) => {
              this.setState({role})
            }
          }}
          onRow={this.onRow}
        />
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({isShowAdd: false})
            this.form.resetFields()
          }}
          >
          <AddForm 
            setForm ={(form) => this.form = form}
          />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({isShowAuth: false})
          }}
          >
          <AuthForm 
            role = {role}
            ref = {this.auth}
          />
        </Modal>
      </Card>
    )
  }
}