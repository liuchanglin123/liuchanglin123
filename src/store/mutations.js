import * as types from './mutation-types'
import storage from '@/utils/storage'


export default  {
  [types.SET_LOGININFO] (state, data) {
    state.userInfo = data;
    storage.localStorage.set('userInfo', data);
  },
  [types.REMOVE_LOGININFO] (state) {
    state.userInfo = null;
    storage.localStorage.remove('userInfo');
  },
  [types.SET_ROUTERTAGS] (state, data) {
    let isRepeat = false;
    state.routerTags.forEach(item => {
      if (item.routerName === data.routerName) {
        isRepeat = true;
        // 路由参数更新
        if (JSON.stringify(item.query) !== JSON.stringify(data.query)) {
          item.query = data.query;
        }
      }
    })
    if (!isRepeat) {
      state.routerTags.push(data);
    }
    storage.sessionStorage.set('routerTags', state.routerTags);
  },
  [types.REMOVE_ROUTERTAGS] (state, data) {
    state.routerTags.forEach((item, i) => {
      if (state.routerTags[i].routerName === data.routerName) {
        state.routerTags.splice(i, 1);
      }
    })
    storage.sessionStorage.set('routerTags', state.routerTags);
  },
  [types.CLEAR_ROUTERTAGS] (state) {
    state.routerTags = [];
    storage.sessionStorage.remove('routerTags');
  },
  [types.SET_FULL] (state, boolean) {
    state.isFull = boolean;
  },
  [types.SET_MENUDATA] (state, data) {
    state.menuData = data;
    let menuBtnList = [];
     // 筛选按钮
    function filterBtn(data, type) {
      data&&data.forEach((item)=>{
        let obj = {};
        if(item.type == type) {
          obj.permission = item.code;
          menuBtnList.push(obj)
        }else{
          filterBtn(item.children, type)
        }
      })
    };
    filterBtn(data, 4)
    storage.localStorage.set('menuBtnList', menuBtnList)
  },
  [types.SET_BTNDATA] (state, data) {
    // 获取按钮的权限code(type=1)
    const btnData = (data || []).filter((item) => item.type === 1).map((item) => item.permissionCode)
    storage.sessionStorage.set('btnData', btnData)
  }
}
