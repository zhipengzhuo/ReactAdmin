// category中添加分类的form组件

import React, {Component} from 'react'
import {Form, Select, Input} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

class AddForm extends Component {
  static propTypes = {
    categorys: PropTypes.array.isRequired, // 一级分类的数组
    parentId: PropTypes.string.isRequired, // 父分类的ID
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
  }
  
  componentWillMount () {
    this.props.setForm(this.props.form)
  }

  render () {
    const {getFieldDecorator} = this.props.form
    const {categorys, parentId} = this.props
    return (
      <Form>
        <Item>
          {
            getFieldDecorator('parentId', {
              initialValue: parentId
            })(
              <Select>
                <Option value='0'>一级分类</Option>
                {
                  categorys.map((category, index) => <Option value={category._id} key={index}>{category.name}</Option>)
                }
              </Select>
            )
          }
         
        </Item>
        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: '',
              rules: [
                {required: true, message: '必须输入分类名称！'}
              ]
            })(
              <Input placeholder='请输入分类名称'/>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddForm)