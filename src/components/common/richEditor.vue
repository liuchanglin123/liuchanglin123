<template>
  <div class="rich-editor">
    <el-upload
      ref="upload"
      action
      :show-file-list="false"
      :accept="accept"
      :http-request="uploadImg"
      :on-succese="uploadSuccess"
      :on-error="uploadError"
      style="display:none"
    ></el-upload>
    <quill-editor
      ref="myQuillEditor"
      v-model="content"
      :options="editorOption"
      @change="handelEditorChange"
    >
    </quill-editor>
    <span class="ruleTxt">{{ matchRuleTxtLimit }} / 5000</span>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import * as Quill from 'quill'

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], //加粗，斜体，下划线，删除线
  [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
  ['image'], //上传图片、上传视频video
  ['blockquote', 'code-block'],
  [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
  [{ list: 'ordered' }, { list: 'bullet' }], //列表
  // [{'script': 'sub'}, {'script': 'super'}],	// 上下标
  [{ indent: '-1' }, { indent: '+1' }], // 缩进
  ['clean'], //清除字体样式
]

export default {
  name: 'rich-editor',
  components: {
    quillEditor,
  },
  props: {
    editorContent: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      accept: 'image/gif,image/jpeg,image/png,image/jpg',
      // 文字限制
      content: '',
      matchRuleTxtLimit: 0,
      editorOption: {
        placeholder: '请输入内容',
        modules: {
          clipboard: {
            // 粘贴版，处理粘贴时候的自带样式
            matchers: [[Node.ELEMENT_NODE, this.handleCustomMatcher]],
          },
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image(value) {
                if (value) {
                  // 触发上传图片事件
                  document.querySelector('.el-upload__input').click()
                } else {
                  this.quill.format('image', false)
                }
              },
            },
          },
        },
      },
    }
  },
  mounted() {
    if (this.editorContent) {
      this.content = this.editorContent
      this.init = true
    } else {
      const unWatch = this.$watch('editorContent', content => {
        this.init = true
        this.content = content
        unWatch()
      })
    }
  
    this.quill = this.$refs.myQuillEditor.quill
  },
  methods: {
    uploadError(e) {
      this.$message.error('上传失败')
    },
    // 文件上传成功时的钩子
    uploadSuccess() {
      this.$message.error('上传成功')
    },
    // http-request 覆盖默认的上传行为，可以自定义上传的实现
    async uploadImg(files) {
      const size = files.file.size / 1024 / 1024
      const imgType = files.file.type.split('/').reverse()[0]
      if (this.accept && this.accept.indexOf(imgType) < 0) {
        this.$message({
          message: `上传文件格式有误，请重新选择`,
          type: 'error',
        })
        this.$refs.upload.clearFiles()
        return
      }
      if (size > this.size) {
        this.$message.error(`上传文件最大不能超过${this.size}M`)
        this.$refs.upload.clearFiles()
        return
      }
      const formData = new FormData()
      formData.append('file', files.file)
      formData.append('type', 0)
      formData.append('rename', true)

      this.$api
        .uploadFile({
          loadingText: '正在上传',
          timeout: 99999999999999,
          data: formData,
        })
        .then((res) => {
          if (res?.code === 0) {
            const quill = this.quill

            const length = quill.getSelection().index
            quill.insertEmbed(length, 'image', res.data)
            quill.setSelection(length + 1)

            this.$refs.upload.clearFiles()
          }
        })
    },
    handleCustomMatcher(node, Delta) {
      // init true，获取接口数据，不做清除样式处理
      if (this.init) {
        return Delta
      }

      // 文字、图片等，从别处复制而来，清除自带样式，转为纯文本
      let ops = []
      Delta.ops.forEach((op) => {
        if (op.insert && typeof op.insert === 'string') {
          ops.push({
            insert: op.insert,
          })
        }
      })
      Delta.ops = ops
      return Delta
    },
    handelEditorChange(e) {
      this.init = false
      e.quill.deleteText(50000, 4)

      // 这里减1是因为这富文本自带第一次默认有一个由 \n 表示的空白行，因此getLength将返回1
      this.matchRuleTxtLimit = e.quill.getLength() - 1
      this.$emit('update:editorContent', this.content)
    },
  },
}
</script>

<style lang="less" scoped>
.ruleTxt {
  position: absolute;
  right: 10px;
  bottom: 5px;
}
</style>
