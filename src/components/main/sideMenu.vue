<template>
  <div class="sideMenu-container">
    <el-row class="tac">
      <el-col class="menu-group">
        <el-menu ref="elMenu" @open="handleOpen" @close="handleClose" :collapse="isCollapse" :unique-opened="true">
          <li class="menu-logo">
            <span class="ct">
              <span class="logo-box">
                <i class="icon el-icon-eleme"></i>
              </span>
              <span class="name">elementUI后台管理系统</span>
            </span>
          </li>
          <li class="menu-wrapper">
            <menu-tree :menuData="menuList"></menu-tree>
          </li>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import menuTree from './menuTree'
import storage from '@/utils/storage'
import { mapActions, mapGetters } from 'vuex'
import menuList from '@/libs/menu/'

export default {
  name: 'sideMenu',
  data() {
    return {
      isCollapse: false,
      menuList: null,
      title: '管理系统-1.0',
    }
  },
  watch: {
    '$route.name': {
      handler(name) {
        this.$nextTick(() => {
          this.$refs.elMenu.updateActiveIndex(
            this.$route.query.activeRouterName || this.$route.meta.parentName || this.$route.name
          )
        })
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters(['entry', 'routerTags', 'menuData']),
  },
  created() {
    // 根据接口返回树配置右侧菜单
    // this.getUserMenus()
    // 根据src/libs/menu/index.js配置右侧菜单
    this.getMenuList()
  },
  mounted() {
    const self = this
    self.eventBus.$on('menuCollapse', (value) => {
      self.isCollapse = value
    })
  },
  methods: {
    // 获取用户菜单（本地）
    getMenuList() {
      this.menuList = menuList
      // 菜单过滤
      let n=0;
      (function filter(treeData) {
        
        for (let i = 0, len = treeData.length; i < len; i++) {
          // 最顶层菜单添加class
          if (n === 0) {
            treeData.map(item => {item.className = 'top-menu-item'});
          }
          let children = treeData[i].children || [];
          if (!children && children.length == 0) {
            return;
          }
          n++;
          // 删除图标(最上级以下全部清除)
          if (n > 0) {
            children.map(item => {delete item.iconCls});
          }
          // 过滤按钮、已冻结菜单
          // treeData[i].children = children.filter(item => {
          //   if (item.type !== 4 && item.status === 1) {
          //     return true;
          //   }
          // });
          filter(children);
        }
      })(this.menuList);
    },

    // 获取用户菜单（接口）
    getUserMenus() {
      // const { menus } = storage.localStorage.get('userInfo') || {}

      // if (!menus) return

      // const flatMenus = menus
      //   .filter((item) => item.type === 0)
      //   .map((item) => ({
      //     iconCls: item.iconClass,
      //     code: item.router,
      //     text: item.name,
      //     id: item.menuId,
      //     parentId: item.parentId,
      //   }))

      // const temp = flatMenus.reduce((obj, item) => ({ ...obj, [item.id]: item }), {})
      // const sideMenus = []

      // for (let id in temp) {
      //   const item = temp[id]
      //   const parentId = temp[id].parentId

      //   if (temp[parentId]) {
      //     temp[parentId].children = [...(temp[parentId].children || []), item]
      //   } else {
      //     sideMenus.push(item)
      //   }
      // }

      // sideMenus.forEach((item) => {
      //   item.className = 'top-menu-item'
      // })

      // this.menuList = sideMenus
      // console.log(this.menuList);
      // return

      this.$api.queryLoginUserMenus().then((res) => {
        if (res?.code === 0) {
          // 扁平化菜单
          this.flatten(res.data)

          function filter(menus) {
            return menus.map((item) => {
              return {
                id: item.menuId,
                text: item.name,
                code: item.router,
                iconCls: item.iconClass,
                ...(item.subMenus.some((x) => x.type === 0)
                  ? { children: filter(item.subMenus.filter((x) => x.type === 0)) }
                  : {}),
              }
            })
          }
          this.menuList = filter(res.data)
          this.menuList.forEach((item) => {
            item.className = 'top-menu-item'
          })

          if (this.$route.name === 'home') {
            let firstMenu = 'storeList'

            try {
              firstMenu = this.menuList[0].children[0].code
            } catch (error) {}

            this.$router.replace({
              name: firstMenu,
            })
          }

          this.$nextTick(() => {
            this.$refs.elMenu.updateActiveIndex(
              this.$route.query.activeRouterName || this.$route.meta.parentName || this.$route.name
            )
          })
        }
      })
    },
    flatten(data) {
      // 处理成平级数据
      function flatMenus(data) {
        return data.reduce((acc, next) => {
          const { type, name, menuId, parentId, permissionCode, subMenus } = next
          acc.push({
            type,
            name,
            menuId,
            parentId,
            permissionCode,
          })

          if (subMenus.length) {
            acc.push(...flatMenus(subMenus))
          }
          return acc
        }, [])
      }

      // 包括菜单和按钮
      const menus = flatMenus(data)
      this.setBtnData(menus)
      // storage.sessionStorage.set('menus', menus)
    },
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    select(index, indexPath) {},
    ...mapActions(['setBtnData']),
  },
  components: {
    menuTree,
  },
}
</script>

<style lang="less">
.sideMenu-container {
  float: left;
  text-align: left;
  height: 100%;
  overflow: hidden;
  background-color: #515a6e;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently */
  .menu-wrapper {
    position: absolute;
    left: 0;
    top: 64px;
    bottom: 0;
    width: 100%;
    overflow: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 0; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 0;
      // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      // background-color: rgba(0, 0, 0, 0.6);
      opacity: 0;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      background-color: transparent;
    }
    .el-menu-item,
    .el-submenu__title {
      background-color: transparent;
      height: 50px;
      line-height: 50px;
    }
    .el-submenu .el-menu-item {
      height: 44px;
      line-height: 44px;
    }
  }
  .el-row,
  .menu-group,
  .el-menu {
    height: 100%;
  }
  .el-menu-item,
  .el-submenu__title {
    color: rgba(255, 255, 255, 0.6);
    &:hover {
      background-color: #4e5c7b;
    }
  }
  .top-menu-item .iconfont {
    margin-right: 3px;
    font-size: 18px;
    color: rgba(255, 255, 255, 0.6);
    width: 24px;
    text-align: center;
    display: inline-block;
  }
  .el-menu-item:focus {
    background-color: transparent;
  }
  .el-menu {
    border-right: none;
    width: 260px;
    background-color: #515a6e;
    .el-menu-item.is-active {
      color: rgba(255, 255, 255, 1);
      background-color: #2d8cf0;
      font-size: 15px;
      &:focus {
        background-color: #2d8cf0;
      }
    }
    &.el-menu--collapse {
      width: 64px;
      .el-submenu__title {
        .el-submenu__icon-arrow {
          display: none;
        }
      }
      .submenu-title {
        .title {
          display: none;
        }
      }
      .menu-logo {
        .ct {
          width: auto;
        }
        .iconfont {
          font-size: 24px;
        }
        .name {
          display: none;
        }
      }
    }
    .is-opened {
      .el-menu {
        background-color: #363e4f;
      }
    }
  }

  .menu-logo {
    color: #ffffff;
    line-height: 64px;
    font-size: 0;
    text-align: center;
    background-color: rgb(81, 90, 110);
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 3;
    .ct {
      height: 64px;
      line-height: 64px;
      overflow: hidden;
      word-break: keep-all;
      white-space: nowrap;
      display: inline-block;
      vertical-align: top;
    }
    .name {
      font-size: 16px;
      display: inline-block;
      vertical-align: top;
      word-break: keep-all;
      margin-left: 7px;
    }
    .logo-box {
      background-color: #409eff;
      width: 36px;
      height: 36px;
      line-height: 36px;
      border-radius: 50%;
      display: inline-block;
      vertical-align: middle;
      text-align: center;
    }
    .icon {
      color: #fff;
      font-size: 20px;
      line-height: inherit;
    }
  }

  .el-submenu__title {
    .el-submenu__icon-arrow {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }
  }
  .top-menu-item {
    &.is-opened {
      background-color: transparent;
      > .el-submenu__title {
        position: relative;
        color: rgba(255, 255, 255, 1);
        .iconfont,
        .el-submenu__icon-arrow {
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
}
</style>
