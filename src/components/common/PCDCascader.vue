<template>
  <el-cascader
    :size="size"
    ref="region"
    style="width: 100%"
    v-model="values"
    :options="cityData"
    :props="{value: 'value', label: 'text', checkStrictly}"
    placeholder="请选择省市区"
    @change="change">
  </el-cascader>
</template>

<script>
import cityData from "@/libs/address/area.json";
export default {
  props: {
    // 回填编码默认值（级联最后一级的值）
    defaultValue: {
      type: String,
      default: () => ''
    },
    size: {
      type: String,
      default: () => 'small'
    },
    // 选择任意一级选项
    checkStrictly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cityData,
      values: []
    }
  },
  watch: {
    defaultValue: {
      handler(value) {
        if (!value) {
          return
        }
        this.values = this.getDataArray(value, 'value', this.cityData, 'value').reverse()
      },
      immediate: true
    }
  },
  created() {
    
  },
  methods: {
    // 根据最后一个区域编码回填
    getDataArray(value, key, data, returnKey) { // value: 值, key: 对应值字段  data: 树结构数据, returnKey是返回想要的key
      const self = this;
      for (var i in data) {
        if (data[i][key] == value) {
          return [data[i][returnKey]];
        }
        if (data[i].children) {
          let ro = self.getDataArray(value, key, data[i].children,returnKey);
          if (ro !== undefined) {
            return ro.concat(data[i][returnKey]);
          }
        }
      }
    },
    change(value) {
      this.$emit('change', value)
    }
  }
}
</script>
