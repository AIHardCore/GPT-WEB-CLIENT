<!--
 * @Description:: 请补充填写
 * @Version: 1.0
 * @Author: smallWhite
 * @Date: 2023-03-21 21:29:37
 * @LastEditors: smallWhite
 * @LastEditTime: 2023-04-04 15:52:23
 * @FilePath: /chat_gpt/src/views/login.vue
-->
<template>
  <div class="s">

    <div class="login">
      <div class="logo">
        <img
            :src="require('../assets/logo1.png')"
            style="width:60px;height:60px">
      </div>
      <h2 v-if="showPage">欢迎登录
      </h2>
      <h2 v-if="!showPage">
        用户注册
      </h2>
      <el-card class="forms"
               v-if="showPage"
               shadow="never">
        <el-form :model="form"
                 :rules="rules"
                 ref="ruleForm"
                 label-position="top"
                 label-width="0px"
                 class="demo-ruleForm">
          <el-form-item
              prop="mobile">
            <el-input
                prefix-icon="el-icon-mobile-phone"
                placeholder="请输入手机号"
                v-model="form.mobile"></el-input>
          </el-form-item>
          <el-form-item
              prop="password">
            <el-input
                :type="type"
                prefix-icon="el-icon-s-goods"
                placeholder="请输入密码"
                v-model="form.password">
              <i slot="suffix"
                 @click="type == 'password'? type ='text':type ='password'"
                 class="el-input__icon el-icon-view"></i>
            </el-input>
          </el-form-item>
          <el-form-item
              prop="name1" v-show="false" >
            <el-input
                prefix-icon="el-icon-user-solid"
                placeholder="请输入姓名"
                v-model="regform.name1"></el-input>
          </el-form-item>
          <el-form-item
              prop="msgCode1" v-show="false">
            <el-input
                prefix-icon="el-icon-folder-checked"
                placeholder="请输入验证码"
                v-model="regform.msgCode1">
              <el-button
                  slot="append"
                  @click="getCode"
                  :disabled="disabled"
                  type="primary">{{ codeText }}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item
              style="margin-bottom: 0;">
            <el-button
                type="primary"
                @click="login"
                style="width:100%">登录</el-button>
          </el-form-item>
          <el-form-item
              style="margin-bottom: 0;">
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="forms"
               shadow="never"
               v-if="!showPage">
        <el-form
            :model="regform"
            :rules="regrules"
            ref="regform"
            label-width="0px"
            class="demo-ruleForm">
          <el-form-item
              prop="mobile">
            <el-input
                type ='text'
                prefix-icon="el-icon-mobile-phone"
                placeholder="请输入手机号"
                v-model="regform.mobile"></el-input>
          </el-form-item>
          <el-form-item
              prop="password">
            <el-input
                :type="type"
                prefix-icon="el-icon-s-goods"
                placeholder="请输入密码"
                v-model="regform.password">
              <i slot="suffix"
                 @click="type == 'password'? type ='text':type ='password'"
                 class="el-input__icon el-icon-view"></i>
            </el-input>
          </el-form-item>
          <el-form-item
              prop="name">
            <el-input
                prefix-icon="el-icon-user-solid"
                placeholder="请输入姓名"
                v-model="regform.name"></el-input>
          </el-form-item>
          <el-form-item
              prop="msgCode">
            <el-input
                prefix-icon="el-icon-folder-checked"
                placeholder="请输入验证码"
                v-model="regform.msgCode">
              <el-button
                  slot="append"
                  @click="getCode"
                  :disabled="disabled"
                  type="primary">{{ codeText }}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item
              style="margin-bottom: 0;">
            <el-button
                type="primary"
                @click="reglogin"
                style="width:100%">
              注册</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-button
          v-if="showPage"
          @click="reg"
          style="width:350px;margin-top:30px">还没有账号？立即注册</el-button>
      <el-button
          v-if="!showPage"
          @click="reg"
          style="width:350px;margin-top:30px">已有账号，立即登录</el-button>
    </div>
<!--    <div id="app">
      <router-view />
      <div style="position:fixed;text-align:center;bottom:0;margin:0 auto;width:100%;color: #5c6b77">
        <a
            target="_blank"
            style="color: #5c6b77"
            href="https://beian.miit.gov.cn/">粤ICP备2023047455号-1</a>
        &nbsp; @2023-2024 HardCore
      </div>
    </div>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      readonly:true,
      showPage: true,
      form: {
        mobile: '',
        password: ''
      },
      time: '',
      regform: {
        name: '',
        name1: '',
        mobile: '',
        password: '',
        msgCode: '',
        msgCode1: '',
      },
      disabled: false,
      timer: null,
      codeText: '获取验证码',
      regrules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { max: 8, min: 2, message: '姓名长度在2-8个字符之间', trigger: 'blur' }
        ],
        msgCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { max: 6, min: 6, message: '请输入6位验证码', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { max: 11, min: 11, message: '手机号格式错误', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      type: 'password',
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { max: 11, min: 11, message: '手机号格式错误', trigger: 'change' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'change' }],
      }
    }
  },
  methods: {
    login() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$https('LOGIN', this.form).then(res => {
            if (res.code == 50000){
              this.$message.success(res.msg)
              return;
            }
            window.localStorage.setItem('userInfo', JSON.stringify(res.data))
            window.localStorage.setItem('token', res.data.token)
            this.$message.success('登录成功！')
            if (this._isMobile()) {
              window.localStorage.setItem('phone', true)
            } else {
              window.localStorage.setItem('phone', false)
            }
            setTimeout(() => {
              this.$router.push('/')
            }, 2000)
          })
        }
      })
    },
    reglogin() {
      this.$refs.regform.validate(valid => {
        if (valid) {
          this.$https('REGISTER', this.regform).then(res => {
            if (res.status == 200) {
              this.$message.success('注册成功！')
              this.showPage = !this.showPage
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    reg() {
      this.showPage = !this.showPage
    },
    getCode() {
      this.$https('GETCODE', {
        mobile: this.regform.mobile
      }).then(res => {
        if (res.status == 200) {
          const TIME_COUNT = 60
          if (!this.timer) {
            this.time = TIME_COUNT
            this.disabled = true
            this.timer = setInterval(() => {
              if (this.time > 0 && this.time <= TIME_COUNT) {
                this.time--
                this.codeText = this.time + 's后获取'
              } else {
                this.disabled = false
                this.codeText = '获取验证码'
                clearInterval(this.timer)
                this.timer = null
              }
            }, 1000)
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    _isMobile() {
      let flag = navigator.userAgent.match(
          /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
      return flag
    }
  }
}
</script>

<style lang="scss">
.login {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #fff;
  display: flex;
  align-items: center;
  flex-flow: column;
  .logo {
    margin-top: 50px;
    background: #fff;
  }
  .forms {
    width: 350px;
    background: #f6f8fa;
  }
}
.el-form--label-top .el-form-item__label {
  padding: 0;
  line-height: 30px;
}

.el-input-group__append button.el-button,
.el-input-group__append div.el-select .el-input__inner,
.el-input-group__append div.el-select:hover .el-input__inner,
.el-input-group__prepend button.el-button,
.el-input-group__prepend div.el-select .el-input__inner,
.el-input-group__prepend div.el-select:hover .el-input__inner {
  background: #409eff;
  color: #fff;
}
.el-button--primary.is-disabled {
  background: #a5d2ff !important;
  color: #fff !important;
}
</style>