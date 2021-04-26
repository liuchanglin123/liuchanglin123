<template>
  <div class="info-panel">
    <h4 class="panel-hd">
      <span class="title">{{title}}</span>
      <span class="tips">{{tips}}</span>
    </h4>
    <div class="panel-bd">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "infoPanel",
  props: {
    title: {
      type: String,
      default: '面板标题'
    },
    tips: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

<style lang="less" scoped>
  .info-panel{
    background-color: #fff;
    .panel-hd{
      padding: 15px 0;
      border-bottom: 1px solid #ebebeb;
      .title{
        color: #333;
        font-size: 16px;
        padding: 0 12px;
        border-left: 3px solid #1989fa;
      }
      .tips{
        font-size: 12px;
        color: #999;
        margin-left: 10px;
      }
    }
    .panel-bd{
      padding: 10px;
      /deep/.base-info{
        padding: 3px;
      }
    }
  }
</style>
