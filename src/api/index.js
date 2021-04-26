import ajax from '@/utils/ajax.js'
export default {
    /*
     *@param {json} options: {} || {data: json}
     */
    /* 请务必注释每个接口所属名称 */

    // 获取登录验证：图片验证码/短信验证码 
    getLoginCheckType: (options = {}) => ajax.post('/dictData/loginCheckType', options),
    // 获取验证码接口
    getPhoneCode: (options = {}) => ajax.post('/getPhoneCode', options),
    // 登录
    getLogin: (options = {}) => ajax.post('/login', options),
    // 获取登录验证码
    getLoginCode: (options = {}) => ajax.post('/getPictureCode', options),
    // 锁屏登录
    getUnlock: (options = {}) => ajax.post('/unlock', options),
    // 登出
    getLogOut: (options = {}) => ajax.post('/logout', options),
    // 获取入口对应菜单
    getUserAndModule: (options = {}) => ajax.post('/module/queryUserAndModule', options),
    // 上传范例
    testUpload: (options = {}) => ajax.upload('/game/uploading', options),
    // 站内信推送
    getMsgWs: (options = {}) => ajax.ws('/socket', options),
    // 覆盖默认api请求地址范例
    testApiUrl: (options = {}) => ajax.post('/test', {
        ...options,
        baseURL: '//10.6.0.89:8080/bms/api'
    }),


}