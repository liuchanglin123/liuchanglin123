// element-ui 获取级联选择数据（Array）
export const getCascaderCheckedItem = function(keys, keyName, options) {
  return keys.map(function (value) {
    for (let item of options) {
      if (item[keyName] == value) {
        options = item.children; 
        return item; 
      }
    }
    return null;
  });
}