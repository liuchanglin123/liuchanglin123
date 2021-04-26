<template>
  <el-dialog
    append-to-body 
    :title="title"
    :visible.sync="show"
    :close-on-click-modal="false"
    width="800px" 
    @closed="$emit('update:showDialog', false)"
  >
    <div class="info-hd">
      <span>
        共{{list.length}}张
      </span>
    </div>
    <el-carousel :autoplay="false" arrow="always" height="500px">
      <el-carousel-item v-for="(url, i) in list" :key="i">
        <img :src="url" class="pic">
      </el-carousel-item>
    </el-carousel>
  </el-dialog>
</template>

<script>
export default {
  name: 'imgPreview',
  props: {
    title: {
      type: String,
      default: '图片预览'
    },
    list: {
      default: () => []
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: this.showDialog
    }
  },
  watch: {
    showDialog(value) {
      this.show = value;
    }
  },
  methods: {
    clearImg() {
      this.imgs = null
    }
  }
}
</script>
 
<style lang="less" scoped>
  .pic{
    max-width: 100%;
    max-height: 100%;
    min-height: 100%;
    display: block; 
    margin: 0 auto;
  }
  .info-hd{
    text-align: center;
    padding-bottom: 20px;
    position: absolute;
    left: 9em;
    top: 25px;
    color: #666;
    font-size: 12px;
  }
</style>