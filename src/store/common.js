export default{
    headImg(){
        let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
        return userInfo.headImgUrl ? userInfo.headImgUrl:require('@/assets/user_avatar.png');
    },
}