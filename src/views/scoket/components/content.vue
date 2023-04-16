<!--
 * @Description:: 请补充填写
 * @Version: 1.0
 * @Author: smallWhite
 * @Date: 2023-03-24 14:28:40
 * @LastEditors: smallWhite
 * @LastEditTime: 2023-04-08 14:10:26
 * @FilePath: /chat_gpt/src/views/scoket/components/content.vue
-->
<template>
  <div>
    <div
        v-for="(item,index) in chatLists"
        :key="index"
        style="margin-bottom: 15px">
      <div
        class="items items_right">
        <div
          v-if="!phone && item.question"
          class="chat_box"
          v-html="item.question">
        </div>
        <div
          v-else-if="phone && item.question"
          class="chat_box phone"
          v-html="item.question">
        </div>
        <div class="tx">
          <img
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            style="width:40px;height:40px">
        </div>
      </div>
      <div class="items"
        v-if="item.answer">
        <div class="tx">
          <img
            :src="require('@/assets/chat.png')"
            style="width:40px;height:40px">
        </div>
        <div
          v-if="!phone && item.answer"
          class="chat_box">
          <div v-highlight
            class="markdown-body"
            v-html="item.answer">
          </div>
        </div>
        <div v-else
          class="chat_box phone">
          <div v-highlight
            class="markdown-body"
            v-html="item.answer ">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 将marked 引入
import { marked } from 'marked'
// 引入代码高亮样式
import 'highlight.js/styles/devibeans.css'

export default {
  props: ['chatList', 'isChat', 'isChats'],
  data() {
    return {
      phone: false,
      mdRegex: '',
      chatLists: [],
      chatObj: {},
      scrollElem:null,
      isOpen: true,
    }
  },
  watch: {
    chatList: {
      handler(val) {
        if (val.length > 0) {
          this.chatObj = {}
          this.chatObj = val[0]
          if (!this.isOpen){
            this.chatLists = val
          }
        }
      },
      deep: true
    },
    isChat(val) {
      console.log(val)
      this.chatObj = {}
      this.chatObj = this.chatList[val]
      this.logPage(this.chatObj.conversationId)
      // if (this.mdRegex.test(this.chatObj.answer)) {
      //   this.chatObj.answer = marked(this.chatObj.answer)
      // }
      this.$forceUpdate()
    },
    isChats(val) {
      this.chatObj = {}
      this.chatObj = this.chatList[0]
      // if (this.mdRegex.test(this.chatObj.answer)) {
      //   this.chatObj.answer = marked(this.chatObj.answer)
      // }
    },
  },
  mounted() {
    this.chatObj = {}
    this.mdRegex = /[#*`|]/
    this.phone = JSON.parse(window.localStorage.getItem('phone'))
    this.chatObj = {}
    if (this.chatList && this.chatList.length > 0) {
      this.chatObj = this.chatList[0]
    }
  },
  methods: {
    logPage(conversationId) {
      this.$https('LOGGAGE', {
        conversationId: conversationId,
        pageNumber: 1,
        pageSize: 5
      }).then(res => {
        this.chatLists = res.data.logPage.records;
        this.$nextTick(() => {
          this.scrollElem.scrollTo({ top: this.scrollElem.scrollHeight, behavior: 'smooth' });
          this.isOpen = false;
        });
      })
    },
    logPageMore(conversationId,pageNumber) {
      this.$loading('.chat_right');
      let flag = false;
      setTimeout(() => {
        this.$https('LOGGAGE', {
          conversationId: conversationId,
          pageNumber: pageNumber,
          pageSize: 5
        }).then(res => {
          if (res.data.logPage.records.length > 0){
            for (let i = 1; i <= res.data.logPage.records.length; i++){
              this.chatLists.unshift(res.data.logPage.records[res.data.logPage.records.length-i]);
            }
            this.$nextTick(() => {
              this.scrollElem.scrollTo({ top: 10, behavior: 'smooth' });
            });
            flag = true;
          }
        })
      }, 500)
      setTimeout(() => {
        this.$emit('updateLoadState',flag);
      }, 500)
    },

    setScrollElem(scrollElem) {
      this.scrollElem = scrollElem;
    },
  }
}
</script>

<style>
.tx {
  width: 40px;
  height: 40px;
}
.chat_box {
  max-width: calc(100vw - 490px) !important;
}
.chat_box.phone {
  max-width: calc(100vw - 120px) !important;
}
</style>