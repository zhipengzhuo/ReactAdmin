// redux最核心的管理对象

import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import reducer from './reducer'

export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk))) // 创建store对象内部第一次调用reducer得到初始状态值