import searchBar from './searchBar.vue'; // 搜索框
import tablePaging from './tablePaging.vue'; // 分页
import controlBar from './controlBar.vue'; // 页面操作
import baseInfo from './baseInfo.vue'; // 详情列表
import infoPanel from './infoPanel.vue'; // 信息面板
import tipsLine from './tipsLine.vue'; // 提示条
import tableRowStatus from './tableRowStatus.vue'; // 表格行状态
import pictureUpload from './pictureUpload' // 照片上传
import timeCounting from './timeCounting' // 倒计时
import fileUpload from './fileUpload' // 文件上传
import addItemBtn from './addItemBtn' // 添加选项条形按钮
import imgPreview from './imgPreview' // 图片预览
import publicTable from './publicTable' // 通用表格
import publicForm from './publicForm' // 通用表单
import popupList from './popupList' // 弹窗列表
import foldPanel from './foldPanel' // 折叠面板
import switchStatus from './switchStatus' // 表格行开关状态
import PCDCascader from './PCDCascader' // element-UI省市区级联选择器
import richEditor from './richEditor'


const commonComponents = {
  install(Vue) {
    Vue.component('searchBar', searchBar)
    Vue.component('tablePaging', tablePaging)
    Vue.component('controlBar', controlBar)
    Vue.component('baseInfo', baseInfo)
    Vue.component('tipsLine', tipsLine)
    Vue.component('tableRowStatus', tableRowStatus)
    Vue.component('pictureUpload', pictureUpload)
    Vue.component('timeCounting', timeCounting)
    Vue.component('fileUpload', fileUpload)
    Vue.component('addItemBtn', addItemBtn)
    Vue.component('imgPreview', imgPreview)
    Vue.component('publicTable', publicTable)
    Vue.component('publicForm', publicForm)
    Vue.component('popupList', popupList)
    Vue.component('infoPanel', infoPanel)
    Vue.component('foldPanel', foldPanel)
    Vue.component('switchStatus', switchStatus)
    Vue.component('PCDCascader', PCDCascader)
    Vue.component('richEditor', richEditor)
  }
}
export default commonComponents;
