/*
 * @Author: your name
 * @Date: 2020-06-08 20:57:28
 * @LastEditTime: 2020-06-08 21:03:44
 * @LastEditors: Please set LastEditors
 * @Description: 提示，消息等
 * @FilePath: \IPTS-office-web\src\utils\message.js
 */ 

// ElementUI提示弹框
import {Message, MessageBox} from 'element-ui'
function showMsg(content, type = 'success') {
  Message[type]({
    message: content
  })
}
function showConfirm(content = '确定执行此操作么？', title = '提示', confirmBtn = '确定', cancelBtn = '取消', type = 'warning', align = false) {
  return MessageBox.confirm(content, title, {
    confirmButtonText: confirmBtn,
    cancelButtonText: cancelBtn,
    type: type,
    center: align
  })
}

export default {
    showMsg,
    showConfirm
}