<template>
  <!-- 收缩面板 -->
  <div class="fold-panel">
    <div class="panel-hd" :class="[isShow?'hd-btn':'']">
      <i @click="toggle" :class="[isShow?'el-icon-caret-bottom':'el-icon-caret-right']" class="panel-caret"></i>
      <h2 class="title" :class="{'flex-auto': !tips}"><span @click="toggle">{{title}}</span></h2>
      <span class="tips flex-auto">{{tips}}</span>
      <span v-if="isBack" class="back" @click="back">返回</span>
      <span @click="toggle" class="text blue">{{collapseName}}&nbsp;<i :class="[isShow?'el-icon-arrow-up':'el-icon-arrow-down']"></i></span>
    </div>
    <div class="panel-bd">
      <el-collapse-transition>
        <div v-show="isShow" class="content">
          <slot></slot>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Panel',
  props: {
    // 面板标题
    title: {
      type: String,
      default: ''
    },
    // 温馨提示
    tips: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    },
    isBack: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      isShow: false,
      isTips: false,
      collapseName: this.show == true ? '收缩' : '展开'
    }
  },
  watch: {
    // show(val) {
    //   this.isShow = val
    //   console.log(val)
    // }
  },
  created () {
    if(this.tips) {
      this.isTips = true;
    }else{
      this.isTips = false;
    }
    this.isShow = this.show;
  },
  methods: {
    back() {
      this.$router.back()
    },
    toggle() {
      this.isShow = !this.isShow;
      this.collapseName = this.isShow?'收缩':'展开'
    }
  }
}
</script>

<style lang="less" scoped>
  .fold-panel{
    border-radius: 4px;
    background-color: #fff;
    border: 1px solid #ebebeb;
    margin-bottom: 15px;
    overflow: hidden;
    .panel-caret{
      font-size: 20px;
      margin-right: 3px;
      color: #606266;
      cursor: pointer;
    }
    .panel-hd{
      padding: 0 15px 0 10px;
      height: 40px;
      background-color: #f5f7fa;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 13px;
      .title{
        font-weight: normal;
        font-size: 14px;
        color: #3a3a3a;
        font-weight: 700;
        border-bottom: 0;
        span{
          cursor: pointer;
        }
      }
      .tips{
        display: inline-block;
        padding-left: 16px;
        color: #f56c6c;
        font-size: 12px;
      }
      .flex-auto{
        flex: 1;
      }
      .text{
        padding: 0 5px;
        cursor: pointer;
      }
    }
    .panel-bd{
      background-color: #fff;
      .content{
        color: #666;
      }
    }
  }
  .hd-btn{
    border-bottom: 1px solid #e8eaec;
  }
  .back{
    display: inline-block;
    padding-right: 8px;
    cursor: pointer;
    position: relative;
  }
  .back::before{
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background-color: #c0c4cc;
  }
</style>