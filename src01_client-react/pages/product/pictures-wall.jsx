// 用于图片上传的组件

import React from 'react'
import { Upload, Icon, Modal, message } from 'antd'
import PropTypes from 'prop-types'

import {reqDeleteImg} from '../../api'
import {BASE_IMG_URL} from '../../utils/constants'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  static propTypes = {
    imgs: PropTypes.array
  }
  constructor (props) {
    super(props)

    const fileList = []
    // 如果传入了imgs属性
    const {imgs} = this.props
    if (imgs && imgs.length > 0) {
      imgs.map((img, index) => ({
        uid: -index, // 每个file唯一的id
        name: img, // 图片文件名
        status: 'done', // 图片的状态，状态有：uploading done error removed
        url: BASE_IMG_URL + img
      }))
    }

    this.state = {
      previewVisible: false, // 标识是否显示大图预览modal
      previewImage: '', // 大图的url地址
      fileList // 所有已上传图片的数组
    }
  }

  // 获取所有已上传图片文件名的数组
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }

  // 隐藏modal
  handleCancel = () => this.setState({ previewVisible: false });

  // 点击文件链接或预览图标时的回调
  handlePreview = async file => {
    console.log(file)
    // 显示指定file对应的大图
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  // fileList:所有已上传图片文件的数组
  // file:当前操作的文件图片（删除/上传）
  handleChange = async ({ file, fileList }) => {
    console.log('handleChange()', file.status, fileList.length)

    // 一旦上传成功，将当前上传的file的信息进行修正（name, url）
    if (file.status === 'done') {
      const result = file.response // {status: 0, data: {name: 'xxx.jpg', url: '图片地址'}}
      if (result.status === 0) {
        message.success('上传图片成功！')
        const {name, url} = result.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else {
        message.error('上传图片失败！')
      }
    } else if (file.status === 'removed') { // 删除图片
      const result = await reqDeleteImg(file.name)
      if (result.status === 0) {
        message.success('删除图片成功！')
      } else {
        message.error('删除图片失败！')
      }
    }

    // 操作（删除，上传）过程中更新fieldlist状态
    this.setState({ fileList })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload" /**上传图片的接口地址 */
          accept='image/*' /**只接收图片格式 */
          name='image'  /**请求参数名 */
          listType="picture-card" /**卡片样式 */
          fileList={fileList} /**所有已上传图片文件对象的数组 */
          onPreview={this.handlePreview} /**点击文件链接或预览图标时的回调 */
          onChange={this.handleChange} /**上传文件改变时的状态 */
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
