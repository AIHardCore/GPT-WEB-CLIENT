<!--
 * @Description:: 请补充填写
 * @Version: 1.0
 * @Author: smallWhite
 * @Date: 2023-03-20 20:49:33
 * @LastEditors: smallWhite
 * @LastEditTime: 2023-04-07 08:04:33
 * @FilePath: /chat_gpt/src/views/scoket/index.vue
-->
<template>
  <div class="contents"
    v-loading="loading">
    <div class="body">
      <Notice :notice="notice"
        @open="open">
      </Notice>
      <div class="main_home">
        <div class="left"
          v-if="!phone">
          <Menu ref="menu"
            @addList="addList"
            :total="totals"
            @changeChat="changeChat"
            :kit-list="kitList"
            :chat-list="chatLists"
            :user-info="userInfo">
          </Menu>
        </div>
        <div
          class="chat_right" ref="chatScroll" v-on:wxj="updateLoadState">
          <Content ref="content"
            :chatIndex="chatIndex"
            :isChats="isChats"
            @updateLoadState="updateLoadState"
            :chatList="newChatList"
            :menuChatList="chatList">
          </Content>
        </div>
      </div>
      <div>
        <div class="tool"
          :class="{'phone':phone}">
          <el-tooltip
            class="item"
            effect="dark"
            content="正常通讯"
            placement="top-start">
            <img
              @click="changeChats(1)"
              src="../../assets/chat_icon.png"
              class="icon">
            1
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="画图"
            placement="top-start">
            <img
              @click="changeChats(3)"
              src="../../assets/picture.png"
              class="icon">
            2
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="充值"
            placement="top-start">
            <div
                style="font-size: 12px;color:#999999" >
              <img
                  @click="changeChats(2)"
                  src="../../assets/pay_2.png"
                  class="icon">
              <div class="tips">充值</div>
            </div>
          </el-tooltip>
          <span
            style="right: 30px;position: absolute;"
            :style="{color:color}">
            <i v-if="color == 'green'"
              class="el-icon-circle-check"
              style="margin-right:5px;font-size: 14px;"></i>
            <i v-if="color == 'red'"
              class="el-icon-circle-close"
              style="margin-right:5px;font-size: 14px;"></i>
            {{ scoketText }}</span>
        </div>
        <SendText ref="sendText"
          @sendText="sendTexts"
          @ok="getData"
          :chatIndex="chatIndex"
          :chatList="chatList"
          :newChatList="newChatList"
          :userInfo="userInfo"
          @total="total">
        </SendText>
      </div>
    </div>
    <el-drawer
      :append-to-body="true"
      :size="'280px'"
      @close="close"
      custom-class="drawer_box"
      :visible.sync="$store.state.drawer"
      :direction="direction"
      :with-header="false">
      <Menu @addList="addList"
        @changeChat="changeChat"
        :total="totals"
        :kit-list="kitList"
        @close="close"
        :chat-list="chatList"
        :user-info="userInfo">
      </Menu>
    </el-drawer>
    <NoticeModal ref="notice">
    </NoticeModal>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisibles"
        width="60%">
      <span>剩余次数不足,是否进行充值？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisibles  = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="showMessageBox">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import { marked } from 'marked'
import Notice from '@/components/notice.vue'
import Menu from './components/menu.vue'
import NoticeModal from './components/noticeModal.vue'
import Content from './components/content.vue'
import SendText from './components/send.vue'
export default {
  name: 'marquee',
  components: { Notice, Menu, NoticeModal, Content, SendText },
  data() {
    return {
      list: [],
      totals: 0,
      dialogVisibles: false,
      sendText: '',
      color: '',
      scoketText: '',
      title: 'New Chat',
      userInfo: {},
      kitList: [],
      scrollFlag: false,
      loading: false,
      chatIndex: 0,
      isChats: 0,
      conversationObj: 0,
      direction: 'ltr',
      chatList: [],
      chatLists: [],
      newChatList:[],
      oldScrollTop: 0,
      phone: false,
      notice: '',
      arr: [],
      mdRegex: '',
      pageNumber: 2,
      loadLogFinish: true,
      currMenuIndex: 0
    }
  },
  created() {},

  mounted() {
    this.mdRegex = /[#*`|]/
    this.phone = JSON.parse(window.localStorage.getItem('phone'))
    document.querySelector('.chat_right').addEventListener('scroll', this.scrolling)
    this.getData()
    this.initWebSocket()
  },
  watch: {
    chatList: {
      handler(val) {
        this.chatLists = val
        this.scrollToBottom()
      },
      deep: true
    },
    newChatList: {
      handler(val) {
        if (this.loadLogFinish){
          this.scrollToBottom()
        }
      },
      deep: true
    },
    arr: {
      handler(val) {
        debugger
        this.loading = false
        this.isChats = val.length
        this.chatList[this.currMenuIndex].answer = ''
        this.chatList[this.currMenuIndex].answer = val.join('')
        if (this.mdRegex.test(this.chatList[this.currMenuIndex].answer)) {
          this.chatList[0].answer = marked(this.chatList[this.currMenuIndex].answer)
        }
        this.newChatList[this.newChatList.length-1].answer = ''
        this.newChatList[this.newChatList.length-1].answer = val.join('')
        if (this.mdRegex.test(this.newChatList[this.newChatList.length-1].answer)) {
          this.newChatList[this.newChatList.length-1].answer = marked(this.newChatList[this.newChatList.length-1].answer)
        }
      }
    }
  },
  methods: {
    // 发送websockwt请求
    initWebSocket() {
      let websocketUrl = this.wsUrl + '/chatWebSocket/' + JSON.parse(window.localStorage.getItem('userInfo')).userId
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      this.webSock = new WebSocket(websocketUrl)
      this.webSock.onopen = this.webSocketOnOpen
      this.webSock.onerror = this.webSocketOnError
      this.webSock.onmessage = this.webSocketOnMessage
      this.webSock.onclose = this.webSocketClose
    },
    webSocketOnOpen() {
      this.scoketText = '连接成功'
      this.color = 'green'
      //  传递参数  不需要传参就不传
      // this.webSocketSend(this.id)
    },
    webSocketOnMessage(e) {
      //console.log(e.data)
      //接收数据
      // this.lists.push(jsonObj.message)
      if (e.data.indexOf("剩余次数不足,请充值") > -1){
        this.dialogVisibles = true;
      }
      //开始回答
      if (e.data == "&BEGIN&"){
        let num = this.$store.state.total
        if (num > 0){
          num = num - 1
        }
        this.$store.commit('SET_TOTAL', num)
        this.totals = num;
      }else{
        this.arr.push(e.data)
      }
    },
    webSocketClose(e) {
      this.scoketText = '断开连接'
      this.color = 'red'
      this.lockReconnect = false
      this.reconnect()
    },
    webSocketOnError(e) {
      this.$message.error('服务器开小差了，等下再试试吧', e)
    },
    webSocketSend(Data) {
      //发送数据发送
      this.webSock.send(Data)
    },
    // 断开重连操作
    reconnect() {
      if (this.lockReconnect) return
      this.lockReconnect = true
      let _this = this
      //没连接上会一直重连，设置延迟避免请求过多
      setTimeout(function () {
        _this.initWebSocket()
        _this.lockReconnect = false
        // _this.isOne = 1;
      }, 2000)
    },
    sendTexts(data) {
      this.arr = []
      this.newChatList.push(data)
      this.chatList[this.currMenuIndex] = (data)
      // this.loading = true
      this.webSocketSend(JSON.stringify(data))
    },
    changeChats(e) {
      if (e == 1) {
        this.$router.push('/scoket')
      } else if (e == 2) {
        this.$router.push('/user/product')
      } else if (e == 3) {
        this.$router.push({
          path: '/scoket',
          query: {
            id: e
          }
        })
      }
    },
    logPage(conversationId) {
      this.$https('LOGGAGE', {
        conversationId: conversationId,
        pageNumber: 1,
        pageSize: 5
      }).then(res => {
        this.newChatList = res.data.logPage.records;
      })
    },
    getData() {
      this.$https('USERHOME', {
        sendType: 1
      }).then(res => {
        this.notice = res.data.content
        //会话列表
        this.chatList = res.data.logList
        //如果有会话列表，则加载第一条会话的聊天记录
        if (this.chatList.length > 0) {
          //加载最后一页聊天记录
          this.logPage(this.chatList[this.currMenuIndex].conversationId)
          this.title = this.chatList[this.currMenuIndex].question
          this.chatList.map(item => {
            if (this.mdRegex.test(item.answer)) {
              item.answer = marked(item.answer)
            }
          })
          this.$refs.sendText.setConversationId(this.chatList[this.currMenuIndex].conversationId)
          let scrollElem = this.$refs.chatScroll;
          this.$refs.content.setScrollElem(scrollElem)
          //设置聊天框的聊天记录
          this.$refs.content.setLogPage(this.newChatList,scrollElem)
        } else {
          const obj = {
            disabled: true,
            question: 'New Chat',
            answer: '',
          }
          this.chatList.push(obj)
        }
        this.kitList = res.data.kitList
        this.userInfo = {
          dayRemainingTimes: res.data.dayRemainingTimes,
          name: res.data.name,
          expirationTime: res.data.expirationTime,
          remainingTimes: res.data.remainingTimes,
          type: res.data.type
        }
        if (res.data.type == 1) {
          this.totals = res.data.remainingTimes;
          this.$store.commit('SET_TOTAL', res.data.remainingTimes)
        } else {
          this.totals = res.data.dayRemainingTimes;
          this.$store.commit('SET_TOTAL', res.data.dayRemainingTimes)
        }
      })
    },
    updateLoadState(flag,pageNumber){
      if (flag){
        this.pageNumber = pageNumber;
      }
      this.loadLogFinish = true;
    },
    close(data) {
      this.drawer = data
      this.$store.commit('SET_OPEN', data)
    },
    addList(data) {
      this.chatList.unshift(data)
    },
    open() {
      this.$router.push('/user/notice')
    },
    scrollToBottom() {
      this.$nextTick(() => {
        var container = this.$el.querySelector('.chat_right')
        container.scrollTop = container.scrollHeight
      })
    },
    scrolling() {
      let scrollTop = document.querySelector('.chat_right').scrollTop
      // 更新——滚动前，滚动条距文档顶部的距离
      let scrollStep = scrollTop - this.oldScrollTop
      this.oldScrollTop = scrollTop
      //判断当前是向上or向下滚动
      if (scrollStep < 0) {
        //向上
        this.scrollFlag = false
        if (scrollTop <= 0 && this.loadLogFinish){
          this.loadLogFinish = false;
          this.$refs.content.logPageMore(this.chatList[this.currMenuIndex].conversationId,this.pageNumber)
        }
      } else {
        this.scrollFlag = true
      }
    },
    total(data) {
      this.totals = data
    },
    changeChat(data) {
      this.loadLogFinish = false;
      this.pageNumber = 1
      this.currMenuIndex = data.data
      this.drawer = data.show
      this.chatIndex = data.data
      this.$store.commit('SET_OPEN', data.show)
      //加载最后一页聊天记录
      this.logPage(this.chatList[this.currMenuIndex].conversationId)
    },
    showMessageBox() {
      this.dialogVisibles = false;
      this.$router.push('/user/product')
    }
  }
}
</script>
<style lang="scss">
.contents {
  .body {
    border: 1px solid #e6e6e6;
    border-radius: 10px;
    overflow: hidden;
    width: calc(100vw - 30px);
    height: calc(100vh - 80px);
    position: relative;
    .main_home {
      display: flex;
      flex-grow: 1;
      .left {
        width: 280px;
        background: #ffffff;
        height: calc(100vh - 120px);
      }
      .chat_right {
        height: calc(100vh - 220px);
        overflow-y: auto;
        width: 100%;
        position: relative;
        .items_right {
          justify-content: flex-end;
        }
        .items {
          display: flex;
          align-items: flex-start;
          width: 100%;
          flex-grow: 1;
          margin-top: 20px;
          .tx {
            width: 30px;
            height: 30px;
            margin-left: 10px;
            border-radius: 10px;
            overflow: hidden;
            margin-right: 10px;
          }
          .chat_box {
            max-width: 60vw;
            padding: 10px 20px;
            background: #ffffff;
            border-radius: 5px;
            margin: 0 10px;
          }
          .chat_box.phone {
            max-width: 60vw;
            padding: 10px 10px;
            background: #ffffff;
            border-radius: 5px;
            margin: 0 0px;
          }
        }
      }
    }
  }
}
.tool.phone {
  width: 100%;
  left: 0;
}
.tool {
  display: flex;
  height: 40px;
  background: #ffffff;
  align-items: center;
  position: absolute;
  bottom: 70px;
  left: 280px;
  width: calc(100% - 290px);
  padding-left: 20px;
  .icon {
    width: 20px;
    margin: 0 10px;
    cursor: pointer;
    filter: grayscale(100%);
  }
  .tips {
    width: 24px;
    margin: 0 10px;
    cursor: pointer;
    filter: grayscale(100%);
  }
  .icon:hover,
  .icon.active {
    filter: grayscale(0);
  }
}
.input_box {
  display: flex;
  padding: 15px 20px;
  width: calc(100% - 290px);
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 270px;
}
.input_box.phone {
  display: flex;
  padding: 15px 20px;
  width: calc(100% - 30px);
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 0;
}
.menu_box.phone {
  width: 240px;
  height: calc(100vh - 145px);
}
.menu_box {
  width: 240px;
  padding: 20px;
  height: calc(100vh - 260px);
  overflow: auto;
  .btnx {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    margin-top: 10px;
    padding: 10px 5px;
    cursor: pointer;
    .input {
      border: 0;
      outline: none;
      background: #ffffff;
    }
  }
  .btnx.active {
    border: 1px solid seagreen;
    color: seagreen;
    .input {
      color: seagreen;
    }
  }
}

.footer {
  border-top: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  flex-grow: 1;
  height: 80px;
}
.footer.phone {
  .lefts {
    width: 50px !important;
    height: 50px !important;
  }
}
</style>
<style lang="scss">
.drawer_box .el-drawer__body {
  background: #ffffff;
}
</style>
