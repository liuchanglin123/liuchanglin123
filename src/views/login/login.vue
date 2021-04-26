<template>
  <div class="login-container">
    <div class="form-bd">
        <div class="form-hl">
          <h6>欢迎登录</h6>
        </div>
        <el-form ref="form" :model="form" :rules="rules" class="form-group">
          <el-form-item prop="account">
            <el-input readonly @focus="e => {e.target.removeAttribute('readonly')}" prefix-icon="el-icon-user" v-model.trim="form.account" placeholder="请输入用户账号" maxlength="25"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input readonly @focus="e => {e.target.removeAttribute('readonly')}" prefix-icon="el-icon-lock" type="password" v-model.trim="form.password" placeholder="请输入用户密码" maxlength="30"></el-input>
          </el-form-item>
          <div class="btn-item">
            <el-button class="btn" type="primary" @click="login">登&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
          </div>
        </el-form>
      </div>
  </div>
</template>

<script>
import rules from "@/utils/rules"
import storage from "@/utils/storage"
import { mapActions } from 'vuex';


export default {
  name: "login",
  data() {
    return {
      form: {
        account: '',
        password: '',
      },
      isReset: false,
      rules: {
        account: [
          { required: true, validator: rules.checkAccount, trigger: ['change','blur']}
        ],
        password: [
          // validator: rules.checkPwd,
          { required: true, message: '用户密码不能为空', trigger: ['change','blur'] }
        ],
      },

    };
  },
  created() {

  },
  mounted(){

  },
  methods: {
    login() {
      this.$router.replace({
        name: 'homeChild1'
      })
    },
  }
};
</script>


<style lang="less" scoped>
.login-container{
  background-image: url("../../assets/img/loginBg.jpg");
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  .form-bd{
    width: 320px;
    height: auto;
    background-color: #fff;
    border-radius: 5px;
    .form-hl{
      padding: 15px 20px;
      h6{
        font-size: 16px;
      }
      border-bottom: 1px solid #dfdfdf;
    }
    .form-group{
      padding: 20px;

    }
    .btn-item{
      margin-top: 30px;

    }
    .btn{
      display: block;
      width: 100%;
    }
  }
}

</style>