<template>
  <div class="contentes">
    <el-card
      class="product_box"
      :class="{'pc':phone?false:true}">
      <div>商品列表</div>
      <el-row :gutter="20">
        <el-col :md="8"
          :sm="12" :xs="24"
          v-for="(item,index) in list"
          :key="index">
          <el-card
            class="cards"
            @click="openPay(item,1)"
            :style="{'background':item.type == 0 ?'rgba(255,0,0,.05)':(item.type == 1?'rgba(0,255,0,.05)':'rgba(255,168,0,.05)')}">
            <div
              class="item name"
              :style="{'background-color':item.type == 0 ?'rgba(255,0,0,.8)':(item.type == 1?'rgba(0,255,0,.8)':'rgba(255,168,0,.8)'),'font-size':'12px'}">
              {{ item.name }}(剩余:
              {{  item.stock}})
            </div>
            <div
              style="display: flex;justify-content: center;align-items: center;">
              <div
                @click="openPay(item,2)"
                class="item price"
                :style="{'color':item.type == 0 ?'red':(item.type == 1?'green':'orange')}">
                ￥{{ item.price }}
              </div>
              <div
                @click="openPay(item,2)"
                class="item wd"
                v-if="item.type !== 1">
                {{ item.numberTimes }}次问答
              </div>
              <div
                @click="openPay(item,2)"
                class="item wd"
                v-if="item.type == 1">
                每日上限：{{ item.monthlyNumber }}次问答
              </div>
            </div>

            <div
              @click="openPay(item,5)"
              class="item remark"
              style="font-size: 12px;"
              v-if="item.type == 5">
              仅限月卡用户使用，有效期一天
            </div>
            <div class="ceng"
              @click="openPay(item,1)">
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card
      style="margin-top: 20px;"
      class="product_box"
      :class="{'pc':phone?false:true}">
      <div
        style="margin-bottom: 10px;">
        订单列表</div>
      <el-table v-if="!phone"
        :header-cell-style="{
        background: '#EEF1F6',
        color: 'rgba(41,44,53,0.7)',
      }" :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="订单编号">
        </el-table-column>
        <el-table-column
          prop="productName"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          prop="payType"
          label="支付方式">
          <template
            slot-scope="scope">
            <span
                v-if="scope.row.payType == 'ALI_PAY'">支付宝支付</span>
            <span
                v-else-if="scope.row.payType == 'WX_PAY'">微信支付</span>
            <span
                v-else-if="scope.row.payType == 'QQ_PAY'">QQ钱包</span>
          </template>
        </el-table-column>
        <el-table-column
          label="支付状态">
          <template
            slot-scope="scope">
            <span
              v-if="scope.row.state == '0'">
              <el-tag
                type="info">待支付</el-tag>
            </span>
            <span
              v-else-if="scope.row.state == '1'">
              <el-tag
                type="success">支付完成</el-tag>
            </span>
            <span
              v-else-if="scope.row.state == '2'">
              <el-tag
                type="danger">支付失败</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          width="180"
          label="支付时间">
        </el-table-column>
        <el-table-column
            label="操作">
          <template
              slot-scope="scope">
            <el-button v-if="scope.row.state == '0'" size="mini" type="primary" @click="pay(scope.row)">去支付</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="phone">
        <el-card
          :body-style="{ padding: '0px' }"
          v-for="(item,index) in tableData"
          :key="index"
          class="cardss">
          <div
            class="card_body">
            <div
              class="items">
              <div
                class="label">
                订单编号：
              </div>
              <div
                  class="value">
                {{ item.tradeNo }}
              </div>
            </div>
            <div
              class="items">
              <div
                class="label">
                订单名称：
              </div>
              <div
                class="value">
                {{ item.productName }}
              </div>
            </div>
            <div
              class="items">
              <div
                class="label">
                商品价格：
              </div>
              <div
                class="value">
                {{ item.price }}
              </div>
            </div>
            <div
              class="items">
              <div
                class="label">
                支付方式：
              </div>
              <div
                class="value">
                <span
                    v-if="item.payType == 'ALI_PAY'">支付宝支付</span>
                <span
                    v-else-if="item.payType == 'WX_PAY'">微信支付</span>
                <span
                    v-else-if="item.payType == 'QQ_PAY'">QQ钱包</span>
              </div>
            </div>
            <div
              class="items">
              <div
                class="label">
                支付状态：
              </div>
              <div
                class="value">
                <span
                  v-if="item.state == '0'">
                  <el-tag
                    size="mini"
                    type="info">待支付</el-tag>
                </span>
                <span
                  v-else-if="item.state == '1'">
                  <el-tag
                    size="mini"
                    type="success">支付完成</el-tag>
                </span>
                <span
                  v-else-if="item.state == '2'">
                  <el-tag
                    size="mini"
                    type="danger">支付失败</el-tag>
                </span>
              </div>
              <div v-if="item.state == '0'">
                <span>
                  <el-button size="mini" type="primary" @click="pay(item)">去支付</el-button>
                </span>
              </div>
            </div>
            <div
              class="items">
              <div
                class="label">
                支付时间：
              </div>
              <div
                class="value">
                {{ item.createTime }}
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>
    <PayModal ref="showPay"
      @payType="payFun">
    </PayModal>
    <PayInfo ref="showPayInfo"
      @payType="payAgainFun">
    </PayInfo>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk';
import PayModal from './components/payModal.vue'
import PayInfo from './components/payInfo.vue'
export default {
  components: { PayModal, PayInfo},
  data() {
    return {
      phone: false,
      url: '',
      list: [],
      form: {},
      payType: 0,
      tableData: []
    }
  },
  mounted() {
    this.phone = JSON.parse(window.localStorage.getItem('phone'))
    this.getData()
  },
  methods: {
    getData() {
      this.$https('PRODUCT', {}).then(res => {
        this.list = res.data.productList
        this.payType = res.data.payType
        this.tableData = res.data.orderList
        window.localStorage.setItem('productList', JSON.stringify(res.data.productList))
        window.localStorage.setItem('orderList', JSON.stringify(res.data.orderList))
      })
    },
    pay(data){
      this.$refs.showPayInfo.open(data)
    },
    handleClose() {
      this.getData()
    },
    payFun(data) {
      this.$message.success('正在发起支付...')
      this.$https('PAY', data).then(res => {
        this.wxPay(res)
      })
    },
    payAgainFun(data) {
      this.$message.success('正在发起支付...')
      this.$https('PAY_AGAIN', data).then(res => {
        this.wxPay(res)
      })
    },
    wxPay(res) {
      if (res.status == 200) {
        if (res.data.code){
          this.$message.warning(res.data.msg)
        }else {
          // 调起微信支付
          let that = this;
          let { appId, nonceStr, timeStamp, paySign } = res.data;
          let prepayId = res.data.package;
          wx.config({
            debug: false, // 测试阶段可用 true 打包返回给后台用 false
            appId: appId,
            timestamp: timeStamp,
            nonceStr: nonceStr,
            signature: paySign,
            jsApiList: ['chooseWXPay']
          });
          wx.ready(function(){
            wx.chooseWXPay({
              appId: appId,
              timestamp: timeStamp, // 时间戳
              nonceStr: nonceStr, // 随机字符串
              package: prepayId, // 统一支付接口返回的prepay_id参数值
              signType: 'MD5', //  签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: paySign, // 支付签名
              success: function (res) {
                this.handleClose();
                that.Toast('支付成功');
                this.$message.success('支付成功')
                setTimeout(() => {
                  location.reload();
                  this.$router.go(0);
                }, 2000)
              },
              cancel: function (res) {
                that.Toast('支付取消');
                this.$message.warning('支付取消')
              },
              fail: function (res) {
                that.Toast('支付失败');
                this.$message.error('支付失败')
              }
            });
          });
        }
      } else if(res.status == 50001){
        this.$router.push('/auth')
      } else {
        this.$message.warning(res.msg)
      }
    },
    openPay(data, index) {
      this.$https('getType', {}).then(res => {
        if (data.type == 5 && res.data.type == 1) {
          this.$alert('只有月卡用户可以购买加油包', '提示')
        } else {
          if (this.payType == 0) {
            this.$refs.showPay.open(data)
          } else {
            window.localStorage.removeItem('type')
            this.$refs.showPay.open(data, this.payType)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.contentes {
  padding: 20px;
  overflow-y: auto;
  width: 100%;
  height: calc(100vh - 60px);
  // display: flex;
  // flex-flow: column;
  // align-items: center;
}
.product_box.pc {
  max-width: 1400px;
}
.product_box {
  background: #fff;
  max-width: 90vw;
  margin: 0 auto;
  .cards {
    position: relative;
    margin: 10px;
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .ceng {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 999;
    }
    .item.name {
      position: absolute;
      right: 0;
      top: -0;
      width: 150px;
      display: inline-block;
      text-align: center;
      color: #fff;
      border-radius: 0 0 0 5px;
    }
    .item.price {
      text-align: center;
      font-size: 24px;
      display: inline-block;
    }
    .item.wd {
      font-size: 13px;
      text-align: center;
      color: #999999;
      display: inline-block;
      margin-left: 20px;
    }
    .remark {
      font-size: 12px;
      text-align: center;
      position: absolute;
      bottom: 5px;
      left: 0;
      width: 100%;
    }
  }
}

.cardss {
  margin-bottom: 20px;
  .card_body {
    overflow: hidden;
    padding: 10px 5px;
    .items {
      display: flex;
      align-items: center;
      height: 24px;
      .label {
        color: #666666;
        width: 70px;
        text-align: justify;
        text-justify: distribute-all-lines;
        text-align-last: justify;
        font-size: 13px;
        -moz-text-align-last: justify;
        -webkit-text-align-last: justify;
      }
      .value {
        font-weight: 500;
        overflow: hidden;
        font-size: 13px;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: calc(80% - 80px);
      }
    }
  }
}
.cards:last-child {
  margin-bottom: 0;
}
</style>