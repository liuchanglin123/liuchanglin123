<template>
  <li>
    <template v-for="item in menuData">
      <el-menu-item :index="item.code" :key="item.id" v-if="!item.children || !item.children.length" @click="to(item.code)"
        :class="item.className"
      >
        <i :class="[item.iconCls && 'iconfont', item.iconCls]"></i>
        <span slot="title">{{item.text}}</span>
      </el-menu-item>
      <el-submenu :index="item.code" v-else :key="item.id" :class="item.className">
        <div class="submenu-title" slot="title">
          <i :class="[item.iconCls && 'iconfont', item.iconCls]"></i>
          <span class="title">{{item.text}}</span>
        </div>
        <menu-tree :menuData="item.children"></menu-tree>
      </el-submenu>
    </template>
  </li>
</template>

<script>
  export default {
    props: ['menuData'],
    name: 'menuTree',
    data() {
      return {
        
      }
    },
    created() {
      
    },
    methods: {
      to(name) {
        this.$router.push({
          name
        }); 
      }
    }
  }
</script>

<style lang="less" scoped>
  
</style>
