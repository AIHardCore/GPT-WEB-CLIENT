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
  <form id='auth'
        :action='form.url'
        method='post'>
    <input type='submit'
           v-show=" false"
           value='正在跳转'>
  </form>
</template>
<script>
export default {
  data() {
    return {
      form: {
        url: ''
      },
      code: undefined
    }
  },
  mounted() {
    let code = ''
    let index = window.location.href.indexOf('?')
    let paramStr =window.location.href.substring(index+1,window.location.href.length);
    let params = paramStr.split('&')
    params.forEach(element => {
      if (element.indexOf('code') >= 0) {
        code = element.substring(element.indexOf('=')+1,element.length)
      }
    });
    if (code){
      this.code = code
      this.login()
    }else {
      this.auth(code)
    }
  },
  methods: {
    login() {
      this.$https('WXLOGIN',{
        code: this.code
      }).then(res => {
        this.$message.success(res.msg)
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
          let index = window.location.href.indexOf('?')
          let href =window.location.href.substring(0,index);
          window.history.replaceState(null, null, href);
          this.$router.push('/')
        }, 2000)
      })
    },
    auth(code) {
      if (code) {

      } else {
        this.$https('WXGZHINFO', this.form).then(res => {
          if (res.status == 200) {
            this.login(res)
            let redirectUri = encodeURIComponent(res.data.redirectUri);
            let url = res.data.codeUrl.replace("{SCOPE}","snsapi_userinfo").replace("{REDIRECT_URI}",redirectUri)
            window.open(url, '_self')
          }
        })
      }
    }
  }
}
</script>