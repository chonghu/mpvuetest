<template>
  <div class="container">
    <text>{{sessionKey}}</text>
    <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取手机号</button>
  </div>
</template>

<script>

export default {
  data () {
    return {
      sessionKey: null,
    }
  },

  methods: {
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: (res) => {
          console.log('code: ', res.code);
          this.$http.get('/pub/wx/auth/login',{code:res.code}).then(d => {
            console.log('data: ', d.data)    
            this.sessionKey = d.data.sessionKey
          }).catch(err => {
            console.log(err.status, err.message)
          })

          wx.getUserInfo({
            withCredentials: true,
            success: (res) => {
              this.userInfo = res.userInfo
              console.log('userInfo: ', this.userInfo)
            },
            fail: (res) => {
              wx.showModal({
                title: '警告',
                content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
                showCancel: true,
                cancelText: '取消',
                cancelColor: '#000000',
                confirmText: '确定',
                confirmColor: '#3CC51F',
                success: (result) => {
                  if(result.confirm){
                    wx.navigateTo({
                      url: '../getUserInfo/main',
                    })
                  }
                },
                fail: ()=>{},
                complete: ()=>{}
              });
            }
          })
        }
      })
    },

    getPhoneNumber(e) {
      let that = this;
      wx.checkSession({
        success: function(res) {
          console.log("checkSession: ", res);
          console.log(e.mp.detail.errMsg);
          console.log(e.mp.detail.iv);
          console.log(e.mp.detail.encryptedData);

          var ency = e.mp.detail.encryptedData;
          var iv = e.mp.detail.iv;
          var sessionk = that.sessionKey;

          if (e.mp.detail.errMsg == "getPhoneNumber:fail user deny") {
            console.log('拒绝')
          } else {
            //同意授权
            wx.request({
              method: "GET",
              url: "https://xxx/wx/deciphering.do",
              data: {
                encrypdata: ency,
                ivdata: iv,
                sessionkey: sessionk
              },
              header: {
                "content-type": "application/json" // 默认值
              },
              success: res => {
                console.log("解密成功~~~~~~~将解密的号码保存到本地~~~~~~~~");
                console.log(res);
                var phone = res.data.phoneNumber;
                console.log(phone);
              },
              fail: function(res) {
                console.log("解密失败~~~~~~~~~~~~~");
                console.log(res);
              }
            });
          }
        },
        fail: function() {
          console.log("session_key 已经失效，需要重新执行登录流程");
          that.wxlogin(); //重新登录
        }
      });
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo()
  }
}
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
