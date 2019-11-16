// 商品分类路由

import React, {Component} from 'react'
import {
    Card,
    Table,
    Button,
    Icon,
    message,
    Modal
} from 'antd'

import LinkButton from '../../components/link-button'
import {reqCategorys, reqUpdateCategory, reqAddCategory} from '../../api'
import AddForm from './addForm'
import UpdateForm from './updateForm'

export default class Category extends Component {
  state = {
    categorys: [], // 一级分类列表
    loading: false, // 是否正在获取数据中
    parentId: '0', // 当前需要显示的分类列表的父分类ID
    parentName: '', // 当前需要显示的分类列表的父分类名称
    subCategorys: [], // 二级分类列表
    showStatus: 0, // 标识添加/更新的确认框是否显示： 0：都不显示 1：显示添加 2：显示更新 
  }

  // 初始化table所有列的数组
  initColumns = () => {
    this.columns = [
      {
        title: '分类的名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        dataIndex: '',
        width: 300,
        render: (category) =>(
          <div>
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
            {/*如何向事件回调函数传递参数：先定义一个匿名函数，在函数中调用事件处理的函数并传入数据 */}
            {
              this.state.parentId === '0' ?  
              <LinkButton onClick={() => this.showSubCategorys(category)}>
                查看子分类
              </LinkButton> : null
            }
          </div>
        )
      }
    ]
  }
  // 显示指定某个一级分类的二级列表
  showSubCategorys = (category) => {
    // 更新状态
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => {
      this.getCategorys()
    })
    // setState()不能立即获取最新的状态，因为setState 是异步更新状态的
    // console.log('parentID' ,this.state.parentId) // 0
    
  }

  // 显示一级分类列表
  showFirstCategorys = () => {
    // 更新为显示一级列表的状态
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }

  // 异步获取一级/二级分类列表显示
  getCategorys = async (parentId) => {
    parentId = parentId || this.state.parentId
    // 发送异步请求前更新loading 状态
    this.setState({loading: true})
    // 发送ajax异步请求
    const result = await reqCategorys(parentId)
    // 发送异步请求后更新loading 状态
    this.setState({loading: false})
    // 获取发送后的数据
    if (result.status === 0) {
      // 得到分类列表（一级或者二级）
      const categorys = result.data
      if (parentId === '0') {
        this.setState({categorys})
      } else {
        this.setState({subCategorys: categorys})
      }
    } else {
      message.error('获取分类列表失败！')
    }
  }

  // 响应点击取消：隐藏确认框
  handleCancel = () => {
    // 清除输入数据
    this.form.resetFields()
    // 隐藏确认框
    this.setState({
      showStatus: 0
    })
  }

  // 显示添加的确认框
  showAdd = () => {
    this.setState({
      showStatus: 1
    })
  }

  // 显示更新的确认框
  showUpdate = (category) => {
    // 保存分类对象
    this.category = category
    // 更新状态
    this.setState({
      showStatus: 2
    })
  }

  // 添加分类
  addCategory = () => {
    // console.log('addCategory()')
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 1. 隐藏确认框
        this.setState({
          showStatus: 0
        })
        // 2. 发送ajax请求更新分类
        // 准备数据
        const {categoryName, parentId} = values
        const result = await reqAddCategory(parentId, categoryName)
        // 清除输入数据
        this.form.resetFields()
        if (result.status === 0) {
          if (parentId === this.state.parentId) {
            // 3. 重新显示列表
            this.getCategorys()
          } else if (parentId === '0') {
            // 在二级分类列表下添加一级分类项，重新获取一级分类列表，但不需要显示一级分类列表
            this.getCategorys('0')
          }
        }
      }
    })

  }

  // 更新分类
  updataCategory = () => {
    console.log('updataCategory()')
    // 进行表单验证，只有通过了才处理
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 1. 隐藏确认框
        this.setState({
          showStatus: 0
        })
        // 2. 发送ajax请求更新分类

        // 准备数据
        const categoryId = this.category._id
        const {categoryName} = values
        const result = await reqUpdateCategory({categoryId, categoryName})
        // 清除输入数据
        this.form.resetFields()
        if (result.status === 0) {
          // 3. 重新显示列表
          this.getCategorys()
        }
      }
    })

  }

  // 为第一次render()准备数据
  componentWillMount () {
    this.initColumns()
  }

  // 执行异步任务：发异步ajax请求
  componentDidMount () {
    // 获取一级分类类别显示
    this.getCategorys()
  }

  render () {

    // 读取状态数据
    const {categorys, subCategorys, parentId, parentName, loading, showStatus} = this.state
    // 读取指定的分类
    const category = this.category || {} // 如果还没有指定一个空对象
    // card的左侧
    const title = parentId === '0' ?'一级分类列表' : (
      <span>
        <LinkButton onClick={this.showFirstCategorys}>一级分类列表</LinkButton>
        <Icon type="arrow-right" style={{marginRight: "10px"}}/>
        <span>{parentName}</span>
      </span>
    )
    // card的右侧
    const extra = (
      <Button type="primary" onClick={this.showAdd}>
        <Icon type="plus"/>
        添加
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
        bordered
        rowKey="_id"
        loading = {loading}
        dataSource = {parentId === '0' ? categorys : subCategorys}
        columns = {this.columns}
        pagination = {{defaultPageSize:5, showQuickJumper: true}}
        />
        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
          >
          <AddForm 
          categorys={categorys} 
          parentId={parentId}
          setForm ={(form) => this.form = form}
          />
        </Modal>
        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updataCategory}
          onCancel={this.handleCancel}
          >
          <UpdateForm 
          categoryName={category.name}
          setForm ={(form) => this.form = form}
          />
        </Modal>
      </Card>

    )
  }
}