/*
export const baseUrl = 'https://gpt.v-wim.xyz-a-s'
 * @Description:: 请补充填写
 * @Version: 1.0
 * @Author: 小白
 * @Date: 2022-04-25 15:58:33
 * @LastEditors: smallWhite
 * @LastEditTime: 2023-04-06 14:23:08
 * @FilePath: /chat_gpt/src/api/api.js
 */
let protocol = window.location.protocol;
let host = window.location.hostname;
if (host.indexOf("localhost") == -1 && host.indexOf("127.0.0.1") == -1){
  host = host + "/gpt";
}else {
  host = host + ":8000";
}
export const baseUrl = protocol + '//' + host;

export const wsUrl = (protocol + '//' + host).replace("http", "ws").replace("https", "wss");

// export const baseUrl = 'http://ee9qu3.natappfree.cc'
export const HTTP_URI = {
  BASEURL: baseUrl,
  GETCODE: baseUrl + '/user/token/smsCode',
  REGISTER: baseUrl + '/user/token/register',
  LOGIN: baseUrl + '/user/token/login',
  PRODUCT: baseUrl + '/product/list',
  USERHOME: baseUrl + '/user/token/home',
  CHAT: baseUrl + '/v1/chat/turbo',
  getType: baseUrl + '/user/token/getType',
  LOGGAGE: baseUrl + '/use/log/queryPage',
  REPEST: baseUrl + '/use/log/updateLog',
  ADD: baseUrl + '/use/log/resetLog',
  NOTICELIST: baseUrl + '/announcement/queryPage',
  PAY: baseUrl + '/order/create',
  PAY_AGAIN: baseUrl + '/order/pay',
  CANVAS: baseUrl + '/v1/chat/official'
}
export default { HTTP_URI, baseUrl }