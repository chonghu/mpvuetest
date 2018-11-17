<template>
  <div class="container">
    <text>sessionKey: {{sessionKey}}</text>

    <div class="userinfo">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
      <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div>
    </div>

    <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取手机号</button>

    <text v-if="phoneNumber">phoneNumber: {{phoneNumber}}</text>
  </div>
</template>

<script>
import card from "@/components/card";

export default {
  data() {
    return {
      userInfo: {},
      sessionKey: null,
      phoneNumber: ""
    };
  },

  components: {
    card
  },

  methods: {
    login() {
      // 调用登录接口
      wx.login({
        success: res => {
          console.log("code: ", res.code);
          this.$http
            .get("/pub/wx/auth/login", { code: res.code })
            .then(d => {
              console.log("data: ", d.data);
              this.sessionKey = d.data.sessionKey;
            })
            .catch(err => {
              console.log(err.status, err.message);
            });

          //获取用户信息
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              this.userInfo = res.userInfo;
              console.log("userInfo: ", this.userInfo);
            },
            fail: res => {
              wx.showModal({
                title: "警告",
                content: "尚未进行授权，请点击确定跳转到授权页面进行授权。",
                showCancel: true,
                cancelText: "取消",
                cancelColor: "#000000",
                confirmText: "确定",
                confirmColor: "#3CC51F",
                success: result => {
                  if (result.confirm) {
                    wx.navigateTo({
                      url: "../getUserInfo/main"
                    });
                  }
                },
                fail: () => {},
                complete: () => {}
              });
            }
          });
        }
      });
    },

    getPhoneNumber(e) {
      let that = this;
      wx.checkSession({
        success: function(res) {
          console.log("checkSession: ", res);
          console.log("errMsg: ", e.mp.detail.errMsg);
          console.log("iv: ", e.mp.detail.iv);
          console.log("encryptedData: ", e.mp.detail.encryptedData);

          var ency = e.mp.detail.encryptedData;
          var iv = e.mp.detail.iv;
          var sessionk = that.sessionKey;
          console.log("sessionKey: ", sessionk);
          if (
            e.mp.detail.errMsg ==
              "getPhoneNumber:fail:cancel to confirm login" ||
            e.mp.detail.errMsg == "getPhoneNumber:fail user deny"
          ) {
            console.log("拒绝");
          } else {
            //同意授权
            that.$http
              .get("/pub/wx/auth/getMiniAppPhoneNumberInfo", {
                encryptedData: ency,
                ivStr: iv,
                sessionKey: sessionk
              })
              .then(d => {
                console.log("data: ", d.data);
                that.phoneNumber = d.data.phoneNumber;
              })
              .catch(err => {
                console.log(err.status, err.message);
              });
          }
        },
        fail: function() {
          console.log("session_key 已经失效，需要重新执行登录流程");
          that.login(); //重新登录
        }
      });
    }
  },

  created() {
    // 调用应用实例的方法获取全局数据
    this.login();
  }
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
