// 包含n个用来创建action的工程函数（action creator）
import {INCREMENT, DECREMENT} from './actions-type'

// 增加的action 
export const increment = number => ({type: INCREMENT, data: number})

// 减少的action ： 返回对象
export const decrement = number => ({type: DECREMENT, data: number})

// 增加的异步action
export const incrementAsync = number => {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment(number))
    }, 1000);
  }
}