<template>
  <div class="picture-upload-comp">
    <div class="upload-bd" :class="{dragged: isDrag}">
      <div
        v-for="(file, index) in fileList"
        :key="index"
        class="el-upload-list"
        @dragstart="dragStartHandler(index)"
        @dragend="dragEndHandler"
        @dragover.prevent
        @drop="dropHandler(index)"
        :draggable="draggable && fileList.length > 1"
      >
        <img class="el-upload-list__item-thumbnail" :src="file.filePath" alt="" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
      <el-upload
        ref="upload"
        action
        :list-type="listType"
        :show-file-list="false"
        :limit="limit"
        :multiple="multiple || false"
        :accept="accept"
        :before-upload="beforeUpload"
        :http-request="uploadImg"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-succese="uploadSuccess"
        :on-error="uploadError"
        :on-progress="uploading"
        :on-exceed="uploadExceed"
        v-if="!disabled"
      >
        <i slot="default" class="el-icon-plus"></i>
      </el-upload>
    </div>
    <p class="tips">{{ tip }}</p>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'pictureUpload',
  props: {
    listType: {
      default: 'picture-card',
    },
    accept: {
      default: 'image/gif,image/jpeg,image/png,image/jpg',
    },
    apiName: {
      default: 'uploadFile',
    },
    limit: {
      default: 1,
    },
    size: {
      default: 2,
    },
    multiple: {
      default: false,
    },
    fileList: {
      default: () => [],
    },
    formData: {
      default() {
        return {
          fileKey: 'uploadFile',
        }
      },
    },
    tip: {
      default: () => '仅支持PNG JPG GIF格式,单张不超过2M',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      isDrag: false,
    }
  },
  methods: {
    showMessage(msg) {
      this.$message.closeAll()
      this.$message.error(msg)
    },
    // before-upload 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUpload(file) {
      console.log(file)
      return
      // 检验上传文件的格式
      // console.log('字节Byte', file.size)
      const size = file.size / 1024 / 1024
      // console.log('M', size)
      // console.log(file.type.split('/')[1])
      // console.log(file.type.split('/').reverse()[0])
      const imgType = file.type.split('/').reverse()[0]
      if (size > 2) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      } else if (this.accept.indexOf(imgType) < 0) {
        this.$message.error(`上传头像图片只能是${this.accept.replace(/image\//g, '')}格式!`)
      }
      return size < 2 && this.accept.indexOf(imgType) > 0
    },
    // 文件上传时的钩子
    uploading(event, file, fileList) {
      console.log(event)
      console.log(files)
      console.log(fileList)
    },
    // on-exceed 文件超出个数限制时的钩子
    uploadExceed(files, fileList) {
      console.log(files)
      console.log(fileList)
    },
    // on-remove 文件列表移除文件时的钩子
    handleRemove(file) {
      const list = this.fileList
      list.splice(
        list.findIndex((item) => file.filePath == item.filePath),
        1
      )
    },
    // 文件上传失败时的钩子
    uploadError(err, file, fileList) {
      console.log(err)
      this.$message.error('上传失败')
    },
    // 文件上传成功时的钩子
    uploadSuccess(response, file, fileList) {
      console.log(response)
      this.$message.error('上传成功')
    },
    // http-request 覆盖默认的上传行为，可以自定义上传的实现
    async uploadImg(files) {
      console.log(files)
      console.log('字节Byte', files.file.size)
      const size = files.file.size / 1024 / 1024
      console.log('M', size)
      console.log(files.file.type.split('/')[1])
      console.log(files.file.type.split('/').reverse()[0])
      const imgType = files.file.type.split('/').reverse()[0]
      if (this.accept && this.accept.indexOf(imgType) < 0) {
        this.$message({
          message: `上传文件格式有误，请重新选择`,
          type: 'error',
        })
        this.$refs.upload.clearFiles()
        return
      }
      if (this.fileList.length >= this.limit) {
        this.$message.error(`上传文件不能超过${this.limit}个`)
        this.$refs.upload.clearFiles()
        return
      }
      if (size > this.size) {
        this.$message.error(`上传文件最大不能超过${this.size}M`)
        this.$refs.upload.clearFiles()
        return
      }
      const formData = new FormData()
      // 父组件传入的formData中的key为fileKey的属性，放入file二进制文件
      formData.append(this.formData['fileKey'], files.file)
      Object.keys(this.formData).forEach((key) => {
        console.log(key)
        // 父组件传入的formData中的key不为fileKey的属性加入对应的属性值
        if (key != 'fileKey') {
          formData.append(key, this.formData[key])
        }
      })
      const res = await this.$api[this.apiName]({
        loadingText: '正在上传',
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          console.log('上传进度事件:', evt)
        },
      })
      if (res && res.code == 0) {
        this.fileList.push({
          filePath: res.data,
        })
        this.$refs.upload.clearFiles()
        this.$emit('onSuccess', {
          filePath: res.data,
        })
      }
    },
    // on-preview 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      console.log(file)
      this.dialogImageUrl = file.filePath
      this.dialogVisible = true
    },
    // 拖拽排序功能
    dragStartHandler(index) {
      this.isDrag = true
      this.startIndex = index
    },
    dragEndHandler() {
      this.isDrag = false
    },
    dropHandler(index) {
      if (index === this.startIndex) return

      const fileList = [...this.fileList]
      ;[fileList[this.startIndex], fileList[index]] = [fileList[index], fileList[this.startIndex]]
      this.$emit('update:fileList', fileList)
    },
  },
}
</script>

<style lang="less" scoped>
.picture-upload-comp {
  .upload-bd {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  .tips {
    margin-top: 10px;
    line-height: 1.2;
    font-size: 12px;
    color: #666;
  }
  /deep/.el-dialog__body {
    border-top: none;
  }
  .el-upload-list {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    margin: 0 8px 8px 0;
    display: inline-block;
  }
  .el-upload-list__item-thumbnail {
    object-fit: contain;
  }
  .el-upload-list__item-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    // transition: opacity 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .upload-bd:not(.dragged) .el-upload-list__item-actions {
    transition: none;
  }
  .upload-bd:not(.dragged) .el-upload-list__item-actions:hover {
    opacity: 1;
  }
  .el-upload-list {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
    font-size: 14px;
    color: #606266;
    line-height: 1.8;
    position: relative;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .upload-wrap {
    width: 148px;
    height: 148px;
    display: inline-block;
    overflow: hidden;
    margin: 0 8px 8px 0;
  }
  .el-upload-list__item-preview,
  .el-upload-delete {
    margin: 0 10px;
    cursor: pointer;
  }
}
</style>
