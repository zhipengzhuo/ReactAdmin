// product的详情页组件

import React, {Component} from 'react'
import {Card, Icon, List} from 'antd'

import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api'

const Item = List.Item

export default class ProductDetail extends Component {
  
  state = {
    cName1: '', // 一级分类名称
    cName2: '', // 二级分类名称
  }

  async componentDidMount () {
    // 得到当前商品的分类ID
    const {categoryId, pCategoryId} = this.props.location.state.product
    // console.log('componentDidMount()', categoryId, pCategoryId)
    if (pCategoryId === '0') { // 一级分类下的商品
      const result = await reqCategory(categoryId)
      const cName1 = result.data.name
      this.setState({cName1})
    } else { // 二级分类下的商品
      /* 通过多个await的方式发多个请求：后面的请求是在前一个请求成功返回之后才发送
      const result1 = await reqCategory(pCategoryId)
      const result2 = await reqCategory(categoryId)
      // console.log('componentDidMount()', result1, result2)
      const cName1 = result1.data.name
      const cName2 = result2.data.name
      */

      // 一次性发送多个请求，只有都成功了才正常处理
      const results = await Promise.all([
        reqCategory(pCategoryId),
        reqCategory(categoryId)
      ])
      console.log('componentDidMount()', results)
      const cData1 = results[0].data
      const cData2 = results[1].data
      if (cData1 && cData2) {
        this.setState({
          cName1: cData1.name,
          cName2: cData2.name})
      } else {
        return
      }
    }
  }

  render () {

    // 读取携带过来的state属性
    // console.log(this.props.location.state)
    const {name, desc, detail, imgs, price} = this.props.location.state.product
    const {cName2, cName1} = this.state
    const title = (
      <span>
        <LinkButton>
          <Icon 
          type='arrow-left' 
          style={{marginRight: '10px', fontSize: 20}} 
          onClick={() => this.props.history.goBack()}
          />
        </LinkButton>

        <span>商品详情</span>
      </span>
    )
    return (
      <Card title={title} className='product-detail'> 
        <List>
          <Item>
            <span className='left'>商品名称</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className='left'>商品描述</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className='left'>商品价格</span>
            <span>{price}</span>
          </Item>
          <Item>
            <span className='left'>所属分类</span>
            <span>{cName1} {cName2 ? '-->' + cName2: ''}</span>
          </Item>
          <Item>
            <span className='left'>商品图片</span>
            <span>
              {
                imgs.map(img => <img 
                  key={img}
                  className='product-img' 
                  src={BASE_IMG_URL + img} 
                  alt='img'
                  />
                )
              }
            </span>
          </Item>
          <Item>
            <span className='left'>商品详情</span>
            <span dangerouslySetInnerHTML={{__html:detail}}>
              
            </span>
          </Item>
        </List>
      </Card>
    )
  }
}