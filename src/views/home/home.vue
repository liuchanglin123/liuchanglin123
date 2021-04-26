<template>
  <div class="home-container">
    <side-menu></side-menu>
    <div class="right-container">
      <admin-header></admin-header>
      <div class="main" id="main" ref="main">
        <div ref="mainBody" class="main-body" :class="{fullHeight: isFullHeight}">
          <keep-alive :include="includes">
            <router-view></router-view>
          </keep-alive>
        </div>
      </div>
    </div>
    <lock-mask></lock-mask>
  </div>
</template>

<script>
import { storage, keepAlive } from '@/utils/cache'
import sideMenu from '@/components/main/sideMenu'
import adminHeader from '@/components/main/adminHeader'
import lockMask from '@/components/main/lockMask'
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'home',
  data() {
    return {
      isFullHeight: false,
      includes: keepAlive.includes,
      cloneIncluds: JSON.parse(JSON.stringify(keepAlive.includes)),
      setFullHeightRouters: [
        'addProcess', 
        'editProcess'
      ],
    }
  },
  watch: {
    '$route'(to, from){
      // 已关闭的keep-alive的路由，重新开启keep-alive
      if (this.cloneIncluds.indexOf(to.name) > -1 && this.includes.indexOf(to.name) < 0) {
        this.includes.push(to.name);
      }
      this.setFullHeight(this.setFullHeightRouters);
    }
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.main.scrollTop = 0;
    });
  },
  created() {
    this.eventBus.$on('removeKeepAlive', routerName => {
      this.includes.splice(this.includes.findIndex(item => item === routerName), 1);
    });
    this.setFullHeight(this.setFullHeightRouters);
  },
  mounted() {
    this.resizeTimer = null;
    this.resize();
    window.addEventListener('resize', () => {
      this.resizeTimer && clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(this.resize, 500);
    })
  },
  destroyed() {
    this.eventBus.$off('removeKeepAlive');
  },
  methods: {
    // 窗口变化设置相关区域高度
    resize() {
      try {
        const header = document.querySelector('.header-container');
        const headHeight = header.offsetHeight;
        this.$refs.main.style.height = `${document.documentElement.clientHeight - headHeight}px`;
      } catch (error) {
        // 未能获取 .header-container
      }
    },
    // 设置路由高度自适应main-body
    setFullHeight(routerNames) {
      if (routerNames.indexOf(this.$route.name) > -1) {
        this.isFullHeight = true;
      } else {
        this.isFullHeight = false;
      }
    },
    ...mapActions(['clearRouterTags'])
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'login') {
      this.clearRouterTags();
    }
    next();
  },
  components: {
    sideMenu,
    adminHeader,
    lockMask
  }
}
</script>

<style lang="less">
  .home-container{
    height: 100%;
    .right-container{
      text-align: left;
      overflow: hidden;
    }
    .main{
      overflow: auto;
      border-radius: 4px;
      padding: 10px;
    }
    .main-body{
      min-height: 100%;
      background-color: #fff;
      box-sizing: border-box;
      position: relative;
    }
    .fullHeight{
      height: 100% !important;
    }
  }
</style>
