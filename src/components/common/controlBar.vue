<template>
  <div class="control-bar-comp" :class="'align-'+position">
    <el-button 
      size="small" 
      v-for="(item, index) in options" 
      :key="index" :icon="`${item.iconClass}`"
      @click="select(item)"
      :type="item.type"
      :disabled="item.disabled"
      v-has="item.permission"
    >
      {{item.name}}
    </el-button>
  </div>
</template>

<script>
  export default {
    name: 'controlBar',
    props: {
      // 位置
      position: {
        default: 'left'
      },
      // 配置参数
      options: {
        default() {
          return [
            // {
            //   type: 'delete', // 按钮类型
            //   name: '按钮名称', // 按钮名称
            //   change() { // 点击执行
            //     console.log('clicked')
            //   }
            // }
          ]
        }
      },
    },
    data() {
      return {
        selectValue: ''
      };
    },
    methods: {
      select(val) {
        this.selectValue = val;
        this.$emit('select', val)
      }
    }
  }
</script>

<style lang="less" scoped>
  .control-bar-comp{
    margin: 10px;
    .el-button{
      margin: 0 8px 0 0;
    }
    &.align-right{
      text-align: right;
    }
    &.align-center{
      text-align: center;
    }
    &.align-left{
      text-align: left;
    }
  }
</style>
