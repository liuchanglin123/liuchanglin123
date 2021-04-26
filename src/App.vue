<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex'

export default {
  name: 'app',
  created() {

  },
  watch: {
    gameTypeData: {
      handler(newValue, oldValue) {
        if(newValue&&newValue.length<1) {
          this.gameTypeData()
        }
      },
      deep: true,
    }
  },
  computed: {
   
  },
  methods: {
    
  }

}
</script>

<style lang="less">
@import './assets/less/app.less';
@import './assets/less/common.less';
</style>
