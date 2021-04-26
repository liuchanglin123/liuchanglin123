/**
 * 导出excel
 *
 * @param {*} blob 数据流
 * @param {*} fileName 文件名
 * @return void
 */
const exportExcel = (blob, fileName) => {
  var blob = new Blob([blob], {
    type: "application/vnd.ms-excel;charset=utf-8"
  });
  // IE兼容
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, fileName + '.xls');
    return
  }
  var url = window.URL.createObjectURL(blob);
  var aLink = document.createElement("a");
  aLink.style.display = "none";
  aLink.href = url;
  aLink.setAttribute("download", fileName + '.xls');
  document.body.appendChild(aLink);
  aLink.click();
  document.body.removeChild(aLink); //下载完成移除元素
  window.URL.revokeObjectURL(url); //释放掉blob对象
  blob = null
}

export default exportExcel
