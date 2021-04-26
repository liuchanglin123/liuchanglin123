<template>
  <div class="user-setting-comp">
    <el-upload
      ref="upload"
      class="avatar-upload"
      action="/file/aaa"
      accept="image/*"
      :show-file-list="false"
      :on-remove="handleRemove"
      :http-request="uploadImg"
      :before-upload="beforeUpload"
      :on-error="uploadError"
    >
      <div class="avatar-box">
        <el-avatar class="avatar" :src="user.avatar" v-if="user.avatar"></el-avatar>
        <el-avatar icon="el-icon-user-solid" class="avatar" v-else></el-avatar>
        <div>
          <el-button type="text" size="small">上传头像</el-button>
        </div>
      </div>
    </el-upload>

    <!-- <public-form
      :formData="form"
      labelWidth="8em"
      ref="baseForm"
      :rules="rules"
      direction="right"
      @change="changeForm"
    ></public-form> -->

    <el-form :model="userForm" :label-width="'7em'">
      <el-form-item :label="'用户账号'" prop="account">
        <el-input v-model="userForm.account" :placeholder="`请输入用户账号`" disabled></el-input>
      </el-form-item>
      <el-form-item :label="'姓名'" prop="name">
        <el-input v-model="userForm.name" :placeholder="`请输入姓名`" disabled></el-input>
      </el-form-item>
      <el-form-item :label="'手机号码'" prop="mobile">
        <el-input v-model="userForm.mobile" :placeholder="`请输入手机号码`" disabled></el-input>
      </el-form-item>
      <el-form-item :label="'邮箱'" prop="email">
        <el-input v-model="userForm.email" :placeholder="`请输入邮箱`" disabled></el-input>
      </el-form-item>
    </el-form>

    <el-form :model="form" ref="ruleForm" :rules="rules" :label-width="'7em'">
      <el-form-item label="请输入旧密码" prop="password">
        <el-input
          prefix-icon="el-icon-lock"
          show-password
          v-model="form.password"
          placeholder="请输入旧密码"
          maxlength="30"
          readonly 
          @focus="e => {e.target.removeAttribute('readonly')}"
        ></el-input>
      </el-form-item>
      <el-form-item label="请输入新密码" prop="newPassword">
        <el-input
          prefix-icon="el-icon-lock"
          show-password
          v-model="form.newPassword"
          placeholder="请输入新密码"
          maxlength="30"
          readonly 
          @focus="e => {e.target.removeAttribute('readonly')}"
        ></el-input>
      </el-form-item>
      <el-form-item label="请确认新密码" prop="rePassword">
        <el-input
          prefix-icon="el-icon-lock"
          show-password
          v-model="form.rePassword"
          placeholder="请确认新密码"
          maxlength="30"
          readonly 
          @focus="e => {e.target.removeAttribute('readonly')}"
        ></el-input>
      </el-form-item>
    </el-form>

    <el-row class="btn-item">
      <el-button
        type="primary"
        v-prevent="1000"
        size="medium"
        @click="submit"
        :id="$route.name + '-setting-submit'"
      >提 交</el-button>
      <el-button size="medium" @click="resetForm" :id="$route.name + '-setting-reset'">重 置</el-button>
    </el-row>
  </div>
</template>

<script>
import rules from "@/utils/rules";
import storage from "@/utils/storage";
import { mapGetters, mapActions } from "vuex";
import {Encrypt, aesEncrypt} from '@/utils/crypto';
const Base64 = require("js-base64").Base64;

export default {
  name: "userSetting",
  data() {
    var pwdValidator = (rule, value, callback) => {
      console.log(value)
      console.log(this.form.newPassword)
      if (value != this.form.newPassword) {
        callback(new Error("两次输入密码不一致!"))
      } else {
        callback()
      }
    }
    return {
      oldAvatar: "",
      user: {
        // avatar: require("@/assets/img/avatar.jpg"),
        // institutionName: "",
        // lastLoginTime: "2019-10-07",
        // loginAddress: "深圳市",
        // loginIp: "10.9.0.110",
        // name: "admin",
        // action: "/file/upload"
      },
      userForm: {
        account: '',
        name: '',
        mobile:'',
        email: ''
      },
      form: {},
      rules: {
        password: [
          {
            require: true,
            message: '旧密码不能为空',
            trigger: ['change','blur']
          }
        ],
        newPassword: [
          {
            require: true,
            validator: rules.checkUnPwd,
            trigger: ['change','blur']
          }
        ],
        rePassword: [
          {
            require: true,
            validator: rules.checkUnPwd,
            trigger: ['change','blur']
          },
          {
            require: true,
            validator: pwdValidator,
            trigger: ['change','blur']
          }
        ]
      },
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created() {
    // 设置登录账户的头像
    this.oldAvatar = this.userInfo.avatar
    this.user = {
      avatar: this.oldAvatar
    }
    this.userForm.account = this.userInfo.account
    this.userForm.name = this.userInfo.name
    this.userForm.mobile = this.userInfo.mobile
    this.userForm.email = this.userInfo.email
    // 填充置灰的用户信息
    // for (let key in this.userform) {
    //   console.log(key)
    //   this.userform[key] = this.userInfo[key]
    // }
  },
  mounted() {
  },
  watch: {
    // formData: {
    //   handler(form) {
    //     if (
    //       form.password === "" &&
    //       form.newPassword === "" &&
    //       form.rePassword === ""
    //     ) {
    //       this.$nextTick(() => {
    //         this.$refs.baseForm.$refs.form.clearValidate();
    //       });
    //     }
    //     if(form.password) {
    //       this.$set(this.rules.newPassword[0], 'validator', rules.checkPwd);
    //     }else{
    //       this.$set(this.rules.newPassword[0], 'validator', rules.checkUnPwd);
    //     }
    //   },
    //   deep: true
    // }
  },
  methods: {
    changeForm(val) {
      this.param = {
        ...this.param,
        ...val
      }
      delete this.param.rePassword
      this.param.type = Number(val.type)
      this.newPassword = val.newPassword
    },
    async submit() {
      const data = { ...this.form, userId: this.userInfo.userId }
      console.log(data)
      // 修改了用户头像，调用用户编辑的接口
      this.$api.editUser({
        data: {
          ...this.userForm,
          avatar: this.user.avatar,
          userId: this.userInfo.userId
        }
      }).then(res => {
        if (res && res.code === 0) {
          // 如果修改了密码
          if (data.password || data.newPassword || data.rePassword) {
            if(data.password==data.newPassword) {
              this.$message.warning('旧密码不能和新密码相同')
              return
            }
            this.$refs.ruleForm.validate(valid => {
              console.log(valid)
              if (valid) {
                if(data.password && data.newPassword) {
                  delete data.rePassword
                  this.save(data)
                }else{
                  this.$message.warning('密码不能为空')
                }
              }
            })
          } else {
            this.$message.success('头像修改成功')
            storage.localStorage.set('userInfo', {...this.userInfo, 'avatar':this.user.avatar})
            // 无需重新获取用户信息userInfo，直接覆盖avatar
            this.$set(this.userInfo, 'avatar', this.user.avatar)
            // delete data.password
            // delete data.newPassword
            // delete data.rePassword
            // this.save(data)
          }
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      // 重置头像
      this.user.avatar = this.oldAvatar
    },
    // 修改了密码才调用
    async save(data) {
      console.log(data)
      const params = {}
      // 如果修改了密码，需要加密处理
      // if (data.password && data.newPassword) {
        params.password = Encrypt(data.password)
        params.newPassword = Encrypt(data.newPassword)
      // }
      const res = await this.$api.updatePassword({
        message: "修改成功, 请重新登录",
        data: {
          ...data,
          ...params
        }
      })
      if (res && res.code == 0) {
        console.log(res)
        // 关闭用户设置弹窗
        this.$emit('enter')
        // 退出登录
        if (data.newPassword) {
          // storage.remove("userInfo")
          this.$router.push({name: "login"})
        }
      } else {
        // this.$message.error("旧密码错误")
      }
    },
    // 文件上传
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    // 限制头像
    beforeUpload(file) {
      let fileType = file.name.substring(file.name.lastIndexOf(".") + 1)
      let types = ["jpg", "png", "jpeg"]
      let isLtType = types.includes(fileType)
      if (!isLtType) {
        this.$message.error("上传头像仅支持 jpg、png、jpeg格式!")
        return false
      }
      const isLt1M = file.size / 1024 / 1024 < 10
      if (!isLt1M) {
        this.$message.error("上传头像大小不能超过 10MB!")
        return false
      }
    },
    uploadError() {
      this.$message.error("上传失败")
    },
    async uploadImg(files) {
      const size = files.file.size / 1024 / 1024
      if (size > 2) {
        this.$message.error("上传文件最大不能超过2M")
        this.$refs.upload.clearFiles()
        return
      }
      if (
        "image/gif,image/jpeg,image/png,image/jpg".indexOf(
          files.file.type.split("/").reverse()[0]
        ) < 0
      ) {
        this.$message.error(`上传文件格式有误，请重新选择`)
        this.$refs.upload.clearFiles()
        return
      }
      let formData = new FormData()
      formData.append("file", files.file)
      formData.append("type", 1)
      formData.append("rename", true)
      const res = await this.$api.uploadFile({
        loadingText: "正在上传",
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          console.log("上传进度事件:", evt)
        }
      });
      if (res && res.code === 0) {
        this.$refs.upload.clearFiles()
        this.user.avatar = res.data
      }
    }
  }
}
</script>

<style lang="less">
.user-setting-comp {
  .avatar-upload {
    text-align: center;
    font-size: 12px;
    width: auto;
    padding: 30px;
    .el-avatar {
      width: 80px;
      height: 80px;
      overflow: hidden;
    }
    .el-icon-user-solid {
      font-size: 60px;
      line-height: 80px;
    }
  }
  .btn-item {
    padding: 20px 0;
    padding-left: 100px;
    text-align: right;
  }
}
</style>
