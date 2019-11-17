import React, {Component} from 'react'
import {Card, Table, Select, Input, Button, Icon, message} from 'antd'

import LinkButton from '../../components/link-button'
import {reqProducts, reqSearchProducts, reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'
import memoryUtils from '../../utils/memoryUtils'

const Option = Select.Option

// product的默认子路由组件

export default class ProductHome extends Component {

  state = {
    products: [], // 商品的数组
    total: 0, // 商品的总数量
    loading: false, // 是否正在加载中
    searchName: '', // 搜索的关键字
    searchType: 'productName', // 搜索的类型
  }

  // 初始化表格列的数组
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '￥' + price // 当前指定了对应的属性，传入的是对应的属性值
      },
      {
        width: 100,
        title: '状态',
        // dataIndex: 'status',
        render: (product) => {
          const {status, _id} = product
          const newStatus = status === 1 ? 2 : 1
          return (
            <span>
              <Button 
                type='primary'
                onClick = {() => this.updaStatus(_id, newStatus)}
              >
                {status === 1? '上架' : '下架'}
              </Button>
              <span>{status === 1 ? '已下架' : '在售'}</span>
            </span>
          )
        }
      },
      {
        width: 100,
        title: '操作',
        render: (product) => {
          return (
            <span>
              {/**将product对象使用state传给目标路由组件 */}
              <LinkButton onClick={() => this.showDetail(product)}>详情</LinkButton>
              <LinkButton onClick={() => this.showUpdate(product)}>修改</LinkButton>
            </span>
          )
        }
      },
    ]
  }

  // 显示商品修改界面
  showUpdate = (product) => {
    memoryUtils.product = product // 缓存product对象给detail组件使用
    this.props.history.push('/product/update')
  }

  // 显示商品详情界面
  showDetail = (product) => {
    memoryUtils.product = product // 缓存product对象给detail组件使用
    this.props.history.push('/product/detail')
  }
  // 上下架更新
  updaStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status)
    if (result.status === 0) {
      message.success('商品更新成功！')
      this.getProducts(this.pageNum)
    }
  }

  // 获取指定页码的列表数据显示
  getProducts = async (pageNum) => { 
    this.pageNum = pageNum // 保存页码，以便其它函数调用
    this.setState({loading: true}) // 显示loading
    const {searchName, searchType} = this.state
    let result
    if (searchName) {
      // 如果搜索关键字有值，说明要进行搜索分页
      result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
    } else { // 一般分页请求
      result = await reqProducts(pageNum, PAGE_SIZE)
    }
    this.setState({loading: false}) // 隐藏loading
    if (result.status === 0 ) {
      // 取出分页数据，更新状态显示分页列表
      const {total, list} = result.data
      this.setState({
        total,
        products: list
      })
    }
  }
  // 初始化数据的准备
  componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getProducts(1)
  }

  render () {
    const {products, total, loading, searchName, searchType} = this.state
    
    const title = (
      <span>
        <Select 
        value={searchType} 
        style={{width:120}} 
        onChange={value => this.setState({searchType: value})}
        >
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input 
        placeholder='关键字' 
        style={{width:150,
        margin: '0 15px'}} 
        value={searchName}
        onChange={event => this.setState({searchName: event.target.value})}
        />
        <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
        <Icon type='plus'/>
        添加商品
      </Button>
     )
    return (
      <Card title={title} extra={extra} > 
        <Table
        loading={loading}
        bordered
        rowKey = '_id'
        dataSource={products} 
        columns={this.columns}
        pagination={{
          current: this.pageNum,
          defaultPageSize: PAGE_SIZE, 
          showQuickJumper: true, 
          total,
          onChange: this.getProducts
        }}
      />
      </Card>
    )
  }
}