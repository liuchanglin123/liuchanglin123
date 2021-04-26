import * as types from './mutation-types'
import api from '../api'

// 入口导航跳转
export function setEntry({commit}, data){
  commit(types.SET_ENTRY, data);
}

// 用户登录
export function setLogin({commit}, data) {
  commit(types.SET_LOGININFO, data);
}

// 删除用户登录信息
export function removeUserInfo({commit}) {
  commit(types.REMOVE_LOGININFO);
}

// 添加路由标签
export function setRouterTags({commit}, data) {
  commit(types.SET_ROUTERTAGS, data);
}
// 移除路由标签
export function removeRouterTags({commit}, data) {
  commit(types.REMOVE_ROUTERTAGS, data);
}
// 清空路由标签
export function clearRouterTags({commit}, data) {
  commit(types.CLEAR_ROUTERTAGS, data);
}

// 全屏切换
export function setFull({commit}, data) {
  commit(types.SET_FULL, data);
}
// 菜单数据
export async function getMenuData({commit}, data) {
  let res = await api.getUserAndModule({data})
  if(res && res.code === 0) {
    commit(types.SET_MENUDATA, res.data)
  }
  return res;
}

// 按钮数据
export function setBtnData({ commit }, data) {
  commit(types.SET_BTNDATA, data)
}
