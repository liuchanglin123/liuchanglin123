<template>
  <div class="header-container">
    <div class="top-bd">
      <i class="menu-collapse iconfont icon-caidan" :class="{isCollapse: isCollapse}" @click="menuCollapse"></i>
      <!-- <span class="headline">elementUI-admin</span> -->
      <admin-info></admin-info>
    </div>
    <page-tags></page-tags>
  </div>
</template>

<script>

import storage from '@/utils/storage'
import pageTags from './pageTags'
import adminInfo from './adminInfo'

export default {
  name: 'adminHeader',
  data() {
    return {
      isCollapse: false,
    }
  },
  created () {
    
  },
  methods: {
    menuCollapse() {
      const self = this;
      if (self.isCollapse) {
        self.eventBus.$emit('menuCollapse', false);
        self.isCollapse = false;
        return;
      }
      self.eventBus.$emit('menuCollapse', true);
      self.isCollapse = true;
    }
  },
  components: {
    adminInfo,
    pageTags
  }
}
</script>

<style lang="less" scoped>
  .header-container{
    box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.2);
    position: relative;
    z-index: 9;
    text-align: left;
    .top-bd{
      background-color: #fff;
      height: 64px;
      box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.2);
    }
    .headline{
      font-size: 18px;
      display: inline-block;
      vertical-align: top;
      line-height: 63px;
    }
    .menu-collapse{
      cursor: pointer;
      line-height: 64px;
      padding: 0 20px;
      font-size: 24px;
      transition: all 0.2s ease 0s;
      display: inline-block;
      color: #666;
      &:hover{
        color: #1082E6;
      }
      &.isCollapse{
        transform: rotate(90deg);
      }
    }
  }
</style>

