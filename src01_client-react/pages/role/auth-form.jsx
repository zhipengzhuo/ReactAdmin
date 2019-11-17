// category中添加分类的form组件

import React, {PureComponent} from 'react'
import {Form, Input, Tree} from 'antd'
import PropTypes from 'prop-types'

import menuList from '../../config/menuConfig'

const Item = Form.Item
const { TreeNode } = Tree

export default class AuthForm extends PureComponent {
  static propTypes = {
    role: PropTypes.object
  }


  constructor(props) {
    super(props)

    // 根据传入角色的munus生成一个初始状态
    const {menus} = this.props.role
    this.state = {
      checkedKeys: menus
    }
  }

  // 为父组件获取最新menu的方法
  getMenus = () => {
    return this.state.checkedKeys
  }

  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
      return pre
    } ,[])
  }

  // 点击复选框触发
  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys })
  }

  componentWillMount () {
    this.treeNodes = this.getTreeNodes(menuList)
  }

  // 根据新传入的role更新checkedKeys状态
  // 当组件接收到新的属性时自动调用（render（）之前）
  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps()', nextProps)
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys: menus
    })
    // this.state.checkedKeys = menus
  }

  render () {
    console.log('AuthForm render()')
    const {role} = this.props
    // console.log("AuthForm render()", role)
    const {checkedKeys} = this.state
    const formItemLayout = {
      labelCol: { span: 4 }, // 左侧label的宽度
      wrapperCol: { span: 15 }, // 指定右侧包裹的宽度
    }
    return (
      <div>
        <Item label='角色名称' {...formItemLayout}>
          <Input value={role.name} disabled/>
        </Item>
        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </div>
    )
  }
}