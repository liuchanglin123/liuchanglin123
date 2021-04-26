<template>
  <div class="base-info">
    <ul class="info-list">
      <li class="info-item" v-for="(item, index) in infoList" :key="index">
        <span class="title">{{item.title}}：</span>
        <!-- !!!!!!$xss 会过滤掉0 -->
        <p v-if="!item.slotName" class="content" v-html="(item.content === null ? '' : item.content !== 0 ? $xss(item.content) : 0) + (item.unit || '')"></p>
        <div class="content" v-if="item.slotName === 'imgList'">
          <!-- 图片展示 -->
          <slot name="imgList"></slot>
        </div>
      </li>
      <slot></slot>
    </ul>
    <slot name="msg-content"></slot>
  </div>
</template>

<script>
export default {
  name: "baseInfo",
  props: {
    infoList: {
      type: Array,
      default: []
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
.base-info {
  color: #666;
  font-size: 14px;
  padding: 10px;
  .info-list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .info-item {
      width: 33.33%;
      line-height: 1.5;
      padding: 10px 5px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
    }
    .title {
      float: left;
      min-width: 7em;
      color: #999;
      border-bottom: 0;
    }
    .content {
      // overflow: hidden;
      color: #666;
      word-break: break-all;
      strong {
        font-size: 24px;
      }
    }
  }
}
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  /* IE10 */
  .info-list .content {
    max-width: 75%;
    display: block;
  }
}
</style>
