/**
 * @description tree数据关联父级parentKey数据回选 
 * @param  {Object} options 参数配置:
 * treeData {Array} tree数据
 * keyValue {String|Number} key值
 * childrenAlias {String} 子级别名
 * keyAlias{String} key别名
 * parentKeyAlias {String} 父级key别名
 * @return {Array} result JSON数组
 */
export const treeReselection = (options) => {
  const {
    keyValue, 
    childrenAlias = 'children', 
    keyAlias = 'id', 
    parentKeyAlias = 'parentId'
  } = options;

  const treeData = JSON.parse(JSON.stringify(options.treeData));
  
  // 先转换一维数组
  function transArr(nodes) {
    let result = [];
    if (Array.isArray(nodes)) {
      for (let i = 0, l = nodes.length; i < l; i++) {
        result.push(nodes[i]);
        if (Array.isArray(nodes[i][childrenAlias]) && nodes[i][childrenAlias].length > 0){
          result = result.concat(transArr(nodes[i][childrenAlias]));
          delete nodes[i][childrenAlias]
        }
      }
    } 
    return result;
  }
  let list = transArr(treeData), isFind = true;

  // 取第一项json
  let result = [list.find(item => item[keyAlias] === keyValue)];

  
  // 过滤
  (function filter(list) {
    if (!isFind) {
      return;
    }
    isFind = false;
    for (let i = 0, len = list.length; i < len; i++) {
      if (result[0][parentKeyAlias] == list[i][keyAlias]) {
        result.unshift(list[i]);
        isFind = true;
      }
    }
    filter(list);
  })(list);

  return result;
}