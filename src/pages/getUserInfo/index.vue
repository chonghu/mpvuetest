<template>
  <div class="container">

    <button open-type="getUserInfo" @getuserinfo="bindGetUserInfo">授权登录</button>
    

  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {}
    };
  },

  methods: {
    bindGetUserInfo() {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              this.userInfo = res.userInfo;
              console.log(this.userInfo);
            },
            fail: res => {
              console.log("拒绝授权");
            }
          });
        }
      });
    },
    
  },

  created() {}
};
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
