/*redux 库的主模块

1) redux 库向外暴露下面几个函数
createStore(): 接收的参数为 reducer 函数, 返回为 store 对象
combineReducers(): 接收包含 n 个 reducer 方法的对象, 返回一个新的 reducer 函数
applyMiddleware() // 暂不实现

2) store 对象的内部结构
getState(): 返回值为内部保存的 state 数据
dispatch(): 参数为 action 对象
subscribe(): 参数为监听内部 state 更新的回调函数

*/


/**
 * 根据指定的reducer函数创建一个store对象并返回
 * 
 */
export function createStore (reducer) {

  // 用来存储内部状态数据的变量,初始值为调用reducer函数返回的结果（外部指定的默认值）
  let state = reducer(undefined, {type: '@@redux/init'})

  // 用来存储监听state更新回调函数的数组容器
  const listeners = []

  /**
   * 返回当前内部的state数据
   */
  function getState () {
    return state
  }

  /**
   * 
   * 分发action：
   * 1）触发reducer调用，得到新的state
   * 2) 保存新的state
   * 3）调用所有已存在的监视回调函数
   * 
   */
  function dispatch (action) {
    // * 1）触发reducer调用，得到新的state
    const newState = reducer(state, action)
    // * 2) 保存新的state
    state = newState
    // * 3）调用所有已存在的监视回调函数
    listeners.forEach(listener => listener())
  } 

  /**
   * 
   * 绑定内部state改变的监听回调 
   * 可以给一个store绑定多个监听
   */
  function subscribe (listener) {
    // 保存到缓存listener的容器数组中
    listeners.push(listener)
  }

  // 返回store对象
  return {
    getState,
    dispatch,
    subscribe
  }
}

/**
 * 整合传入对象中的多个reducer的函数，返回一个新的reducer，
 * 新的reducer管理的总状态: {r1: state1, r2: state2}
 * 
 * reducers的结构：
 * {
 *    count: (state=2, action) => 3,
 *    user: (state={}, action) => {}
 * }
 * 得到的总状态的结构：
 * {
    count: count(state.count, action),
    user: user(state.user, action)
    }
 */

export function combineReducers (reducers) {

  return (state = {}, action) => {
    return Object.keys(reducers).reduce((totalState, key) => {
      totalState[key] = reducers[key](state[key], action)
      return totalState
    }, {})
  }



/* foreach方法实现
export function combineReducers (reducers) {
  // 返回一个新的总reducer函数
    // state: 总状态
  return (state = {}, action) => {
    // 准备一个总状态空对象
    const totalState = {}
    // 执行reducers中每个reducer函数，得到一个新的子状态，并添加到一个对象容器中
    Object.keys(reducers).forEach(key => {
      totalState[key] = reducers[key](state[key], action)
    })
    // 返回总状态对象
    return totalState
  }
  */
}