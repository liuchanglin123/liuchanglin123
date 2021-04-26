<template>
  <div class="tips-line-comp">
    <i class="el-alert__icon el-icon-info"></i>
    <p>
      <slot></slot>
    </p>
  </div>
</template>

<script>
  export default {
    name: 'tipsLine',
    props: {

    },
    data() {
      return {

      };
    },
    created() {

    },
    methods: {

    }
  }
</script>

<style lang="less">
  .tips-line-comp{
    height: 32px;
    line-height: 32px;
    background-color: #f0faff;
    border: 1px solid #abdcff;
    font-size: 12px;
    color: #515a6e;
    border-radius: 4px;
    padding: 0 10px;
    margin: 10px 0;
    display: flex;
    align-items: center;
    p{
      display: inline;
    }
    em{
      color: #2d8cf0;
      font-style: normal;
      padding: 0 3px;
    }
    i{
      vertical-align: middle;
      color: #2d8cf0;
      margin-right: 5px;
    }
  }
</style>
