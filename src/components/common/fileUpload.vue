<template>
  <div>
    <el-upload
      action
      :limit="limit"
      :show-file-list="true"
      :on-remove="handleRemove"
      :http-request="uploadFile"
      :accept="accept"
      :drag="drag || false"
      :multiple="multiple || false"
      :on-error="uploadError"
      ref="upload"
      :on-change="onChange"
    >
      <el-button size="small" type="danger" v-if="!drag">
        {{title}}
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
      <div v-else>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </div>
      <div slot="tip" class="el-upload__tip">{{uploadTip}}</div>
    </el-upload>
    <ul class="el-upload-list el-upload-list--text">
      <li class="el-upload-list__item is-success" v-for="(file, index) in fileList" :key="index">
        <span class="el-upload-list__item-name">
          <i class="el-icon-document"></i>
          {{file.filePath.split('/').pop()}}
        </span>
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-circle-check"></i>
        </label>
        <i class="el-icon-close" @click="handleRemove(file)"></i>
      </li>
    </ul>
  </div>
     
</template>

<script>
export default {
  name: "fileUpload",
  props: {
    accept: {
      default: ''
    },
    limit: {
      default: 1
    },
    size: {
      default: 2
    },
    multiple: {
      default: false
    },
    drag: {
      default: false
    },
    title: {
      default: '上传文件'
    },
    apiName: {
      default: 'uploadFile'
    },
    uploadTip: {
      default: '上传jpg，png，zip，rar文件，且不超过500kb'
    },
    fileList: {
      default: () => []
    },
    formData: {
      default() {
        return {
          fileKey: 'uploadFile' 
        }
      }
    },
  },
  data() {
    return {
    };
  },
  watch: {

  },
  computed: {

  },
  created() {

  },
  mounted() {

  },
  methods: {
    onChange() {
      this.$emit('onChange')
    },
    showMessage(msg) {
      this.$message.closeAll();
      this.$message.error(msg);
    },
    // 文件上传
    handleRemove(file) {
      const list = this.fileList;
      list.splice(list.findIndex(item => file.filePath == item.filePath), 1);
    },
    uploadError(err) {
      this.$message.error('上传失败')
    },
    async uploadFile(files) {
      const size = files.file.size / 1024 / 1024;
      if (this.accept && this.accept.indexOf(files.file.type.split('/').reverse()[0]) < 0) {
        this.showMessage(`上传文件格式有误，请重新选择`);
        this.$refs.upload.clearFiles();
        return;
      }
      if (this.fileList.length >= this.limit) {
        this.showMessage(`上传文件不能超过${this.limit}个`);
        this.$refs.upload.clearFiles();
        return;
      }
      if (size > this.size) {
        this.showMessage(`上传文件最大不能超过${this.size}M`);
        this.$refs.upload.clearFiles();
        return;
      }
      const formData = new FormData();
      
      formData.append(this.formData['fileKey'], files.file);
      Object.keys(this.formData).forEach(key => {
        if (key != 'fileKey') {
          formData.append(key, this.formData[key]);
        }
      })
      const self = this;
      const res = await this.$api[this.apiName]({
        timeout: 99999999999999,
        closeLoading: true,
        data: formData,
        onUploadProgress(evt) {
          console.log("上传进度事件:", evt);
          let percent = (evt.loaded / evt.total * 100) || 0
          files.onProgress({percent: percent})
        }
      });
      if (res && res.code == 0) {
        this.fileList.push({
          filePath: res.data
        });
        this.$refs.upload.clearFiles();
        this.$emit('onSuccess', {
          filePath: res.data
        });
      }
    },
  }
};
</script>

<style lang="less" scoped>
  .el-upload__tip{
    margin-top: 10px;
    line-height: 1.2;
  }
</style>