/*
export const baseUrl = 'https://gpt.v-wim.xyz-a-s'
 * @Description:: 请补充填写
 * @Version: 1.0
 * @Author: 小白
 * @Date: 2022-04-25 15:58:33
 * @LastEditors: smallWhite
 * @LastEditTime: 2023-05-06 10:41:06
 * @FilePath: /chat_gpt/src/api/api.js
 */
// export const baseUrl = 'https://gpt.v-wim.xyz'
export const baseUrl = 'https://gpt.v-wim.xyz'
export const wsUrl = 'wss://gpt.v-wim.xyz'
// export const wsUrl = 'wss://ca1a-61-176-96-198.ngrok-free.app'

// export const baseUrl = 'http://ee9qu3.natappfree.cc'
export const HTTP_URI = {
  BASEURL: baseUrl,
  REGISTER: baseUrl + '/user/token/register',
  LOGIN: baseUrl + '/user/token/login',
  PRODUCT: baseUrl + '/product/list',
  ALIPAY: baseUrl + '/order/ali/create',
  USERHOME: baseUrl + '/user/token/home',
  CHAT: baseUrl + '/v1/chat/turbo',
  getType: baseUrl + '/user/token/getType',
  REPEST: baseUrl + '/use/log/updateLog',
  ADD: baseUrl + '/use/log/resetLog',
  NOTICELIST: baseUrl + '/announcement/queryPage',
  PAY: baseUrl + '/order/create',
  CANVAS: baseUrl + '/v1/chat/official',
  REGTYPE: baseUrl + '/user/token/get/register/method',
  GETCODE: baseUrl + '/user/token/send/msg',
  CODEREG: baseUrl + '/user/token/register/msm',
  WEIPAY: baseUrl + '/order/wx/create',
  GETSDSTATE: baseUrl + '/user/token/getFunctionState',
  CREATESD: baseUrl + '/sd/create',
  EMAILREG: baseUrl + '/user/token/register/email',
  SENDMAILCODE: baseUrl + '/user/token/send/mail',
  GETMODE: baseUrl + '/sd/getModel',
  GETMODES: baseUrl + '/sd/getSamplers'
}
export default { HTTP_URI, baseUrl }
