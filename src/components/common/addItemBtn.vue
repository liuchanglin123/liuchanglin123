<template>
  <div class="add-item-btn" @click="onAdd" :class="{disabled: disabled}">
    +
    <span>{{name}}</span>
  </div>
</template>

<script>
export default {
  name: 'addItemBtn',
  props: {
    // 名称
    name: {
      type: String,
      default: ''
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  created () {

  },
  methods: {
    onAdd() {
      if (this.disabled) {
        return;
      }
      this.$emit('onAdd');
    }
  }
}
</script>

<style lang="less" scoped>
  .add-item-btn{
    text-align: center;
    color: #999;
    border: 1px dashed #dfdfdf;
    border-radius: 5px;
    background-color: #fff;
    cursor: pointer;
    padding: 10px;
    font-size: 14px;
    &:hover{
      opacity: 0.7;
      border: 1px dashed #409EFF;
      color: #409EFF;
    }
    &.disabled{
      cursor: not-allowed;
    }
  }
</style>
