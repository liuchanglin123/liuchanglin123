<template>
  <div class="page-tags-con">
    <div class="tags-scroller">
      <div class="tags-list" :style="{left: translateX + 'px'}">
        <el-tag
          :class="{current:$route.name == tag.routerName}"
          v-for="(tag, index) in routerTags"
          :key="index"
          :closable="closable"
          :type="$route.name == tag.routerName ? '' : 'info'"
          :disable-transitions="true"
          @click="to(tag)"
          @close="close(tag, index)"
        >
          {{tag.name}}
        </el-tag>
      </div>
    </div>
    <el-dropdown class="right-dropdown" trigger="click" size="small">
      <el-button class="right-btn" type="primary" size="mini">
        标签选项
        <i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="close(currentTag, current)">关闭当前</el-dropdown-item>
        <el-dropdown-item @click.native="clearTags">关闭其他</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import windowScreen from '@/utils/windowScreen'

export default {
  name: 'pageTags',
  data() {
    return {
      tagMargin: 4,
      translateX: 0,
      currentTag: null,
      current: 0,
      closable: true
    }
  },
  watch: {
    routerTags(val) {
      if (val.length === 1) {
        this.closable = false;
        return;
      };
      this.closable = true;
    },
    $route(to, from) {
      const currentTag = {
        name: to.meta.title,
        routerName: to.name,
        query: to.query
      }
      this.setRouterTags(currentTag);
      this.setCurrentTag(currentTag);
      this.$nextTick(() => {
        this.scrollX()
      })
    }
  },
  computed: {
    ...mapGetters(['routerTags'])
  },
  created () {
    this.init();
  },
  mounted () {
    this.$nextTick(() => {
      this.tagScroller = document.querySelector('.tags-scroller');
      this.tagList = document.querySelector('.tags-list');
      this.scrollX();
      let flag = true;
      window.addEventListener('resize', () => {
        if (flag) {
          flag = false;
          setTimeout(() => {
            this.resize();
            flag = true;
          }, 500)
        }
      })
    })
    // 标签页关闭监听
    this.eventBus.$on('closeTag', (routerName) => {
      const index = this.routerTags.findIndex(item => item.routerName === routerName);
      const tag = this.routerTags.find(item => item.routerName === routerName);
      this.close(tag, index);
    })
  },
  destroyed() {
    this.eventBus.$off('closeTag');
  },
  methods: {
    init() {
      if (this.$route.name === 'home') {
        return
      }
      const currentTag = {
        name: this.$route.meta.title,
        routerName: this.$route.name,
        query: this.$route.query
      }
      this.setRouterTags(currentTag);
      this.setCurrentTag(currentTag);
    },
    to(item) {
      this.$router.push({
        name: item.routerName,
        query: item.query
      })
    },
    close(item, index) {
      if (this.routerTags.length === 1) {
        return;
      }
      // 移除keep-alive
      this.eventBus.$emit('removeKeepAlive', item.routerName);
      // 更新滚动位置
      const tags = document.querySelectorAll('.el-tag');
      const currentTag = tags[index];
      this.translateX += (currentTag.offsetWidth + this.tagMargin);
      if (this.translateX > 0) {
        this.translateX = 0;
      }
      this.removeRouterTags(item);
      if (this.$route.name === item.routerName) {
        const witch = index - 1 < 0 ? (index) : (index - 1);
        this.$router.push({
          name: this.routerTags[witch].routerName,
          query: this.routerTags[witch].query
        });
        
      }
    },
    setCurrentTag(currentTag) {
      this.currentTag = currentTag;
      this.current = this.routerTags.findIndex(item => item.routerName === currentTag.routerName);
    },
    clearTags() {
      this.clearRouterTags();
      this.init();
      this.translateX = 0;
    },
    resize() {
      if (this.tagScroller.offsetWidth < this.tagList.offsetWidth) {
        const dx 
        = this.tagScroller.getBoundingClientRect().right 
        - this.tagMargin 
        - this.tagList.getBoundingClientRect().right;
        this.translateX += dx;
      } else {
        this.translateX = 0;
      }
    },
    // 滚动
    scrollX() {
      // 标签栏滚动
      let x = 0;
      const wrapper = this.tagScroller,
      tags = document.querySelectorAll('.el-tag'),
      currentTag = tags[this.current];
      if (!currentTag) {
        return
      }
      const currentTagPosition = currentTag.getBoundingClientRect(),
      wrapperPosition = wrapper.getBoundingClientRect(),
      tagMargin = this.tagMargin,
      boundary = 50;
      if (currentTagPosition.right >= wrapperPosition.right - boundary) {
        const nextTag = tags[this.current + 1];
        if (nextTag) {
          x = -nextTag.getBoundingClientRect().right + wrapperPosition.right - tagMargin;
        } else {
          x = -currentTagPosition.right + wrapperPosition.right - tagMargin;
        }
      } else if (currentTagPosition.left < wrapperPosition.left + boundary) {
        const prevTag = tags[this.current - 1];
        if (prevTag) {
          x = wrapperPosition.left - prevTag.getBoundingClientRect().left + tagMargin;
        } else {
          x = wrapperPosition.left - currentTagPosition.left + tagMargin;
        }
      }
      this.translateX += x;
      if (this.translateX > 0) {
        this.translateX = 0;
      }
    },
    ...mapActions(['setRouterTags', 'removeRouterTags', 'clearRouterTags'])
  }
}
</script>

<style lang="less">
  .page-tags-con{
    padding: 5px 10px 5px 0;
    position: relative;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Chrome/Safari/Opera */
    -khtml-user-select: none; /* Konqueror */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    .tags-scroller{
      overflow: hidden;
      position: relative;
      height: 32px;
      margin-right: 90px;
    }
    .tags-list{
      white-space: nowrap;
      word-break: keep-all;
      position: absolute;
      left: 0;
      top: 0;
      transition: left 0.2s ease 0s;
      transform: translate3d(0,0,0);
    }
    .el-tag{
      cursor: pointer;
      background-color: #fff;
      margin-left: 4px;
      position: relative;
      overflow: hidden;
      &:before{
        content: "";
        width: 12px;
        height: 12px;
        background-color: #e8eaec;
        float: left;
        border-radius: 100%;
        margin-top: 9px;
        margin-right: 7px;
      }
      &.current{
        &:before{
          background-color: #409eff;
        }
      }
    }

    .right-dropdown{
      position: absolute;
      padding: 7px;
      background-color: #fff;
      right: 0;
      top: 0;
      box-shadow: -3px 0 15px 3px rgba(0,0,0,.1);
    } 
    .right-btn{
      padding: 7px;
      width: auto;
    }
  }
</style>