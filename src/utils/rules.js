// 表单验证规则 for ElementUI
import patterns from '@/libs/patterns/patterns'
export default {
  // 为空
  checkEmpty: (rule, value, callback) => {
    const _value = String(value).trim()
    if (_value === '') {
      return callback(new Error(rule.message))
    }
    callback()
  },
  // 检测手机号
  checkPhone: (rule, value, callback) => {
    const _value = String(value).trim()
    if (!patterns.phone.test(_value)) {
      return callback(new Error(rule.message || '手机号输入有误'))
    }
    callback()
  },
  // 检测邮箱
  checkEmail: (rule, value, callback) => {
    const _value = String(value).trim()
    if (!patterns.email.test(_value)) {
      return callback(new Error(rule.message || '邮箱格式不正确'))
    }
    callback()
  },
  // 用户密码
  checkPwd: (rule, value, callback) => {
    const _value = (value + '').trim()
    const test = !(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[\W])(?=.*[\S])^[0-9A-Za-z\S]{8,30}$/g).test(_value) ? false : true
    if (!_value) {
      return callback(new Error('密码不能为空'))
    }
    if (!test) {
      return callback(new Error('8-30个字符，必须包含大、小写字母，数字和特殊字符组成'));
    }
    callback()
  },
  // 用户密码(可选)
  checkUnPwd: (rule, value, callback) => {
    const _value = (value + '').trim()
    const test = !(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[\W])(?=.*[\S])^[0-9A-Za-z\S]{8,30}$/g).test(_value) ? false : true
    if (_value&&!test) {
      return callback(new Error('8-30个字符，必须包含大、小写字母，数字和特殊字符组成'))
    }
    callback()
  },
  // 用户密码
  checkPassword: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const reg = /^[a-zA-Z0-9!@#$%\^&_+=-]{6,16}$/g
    // if (!_value) {
    //   return callback(new Error('密码不能为空'))
    // }
    if (_value && !reg.test(_value)) {
      return callback(new Error('仅支持6-16位数字，英文大小写或特殊字符'));
    }
    callback()
  }
}
