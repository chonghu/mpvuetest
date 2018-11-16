<template>
  <!-- <div class="wrapper">
    CustomPage
  </div> -->

  <div class="wrapper">
    <div class="loading" :hidden="searchLoading">下拉刷新...</div>
    <div>
      <scroll-view scroll-y="true" @scrolltolower="searchScrollLower">
        <div v-for="(item, index) in activities" :key="index" class="result-item">
          <text class="title">{{index}}.{{item.title}}</text>
        </div>
        <view class="loading" :hidden="!searchLoading">正在载入更多...</view>
        <view class="loading complete" :hidden="!searchLoadingComplete">已加载全部</view>
      </scroll-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: this.$kyutil.formatTime(new Date()),
      activities: [],
      isFromSearch: true, // 用于判断searchSongList数组是不是空数组，默认true，空的数组
      searchPageNum: 1, // 设置加载的第几次，默认是第一次
      callbackcount: 20, //返回数据的个数
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏
      searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏
    };
  },

  methods: {
    getData() {
      let that = this;
      this.$http
        .get("/pub/wx/home/getData", {
          communityId: 1,
          p: that.searchPageNum,
          n: that.callbackcount
        })
        .then(d => {
          // //输出请求数据
          console.log(d.data);
          if (d.data.activities && d.data.activities.length > 0) {
            let items = [];
            if (that.isFromSearch) {
              items = d.data.activities;
            } else {
              items = that.activities.concat(d.data.activities);
            }
            that.activities = items;
            that.searchLoading = true;
          } else {
            that.searchLoadingComplete = true; //显示没有数据
            that.searchLoading = false; //不显示上拉加载
          }

          wx.hideNavigationBarLoading();
        })
        .catch(err => {
          console.log(err.status, err.message);
        });
    },
    //滚动到底部触发事件
    searchScrollLower() {
      console.log('scroll')
      let that = this;
      if (that.searchLoading && !that.searchLoadingComplete) {
        that.searchPageNum = that.searchPageNum + 1;
        that.isFromSearch = false;
        that.getData();
      }
    },
  },
  //上拉加载
  onReachBottom() {
    let that = this;
    that.searchScrollLower()
  },
  //下拉刷新
  async onPullDownRefresh() {
    wx.showNavigationBarLoading();
    let that = this;
    console.log('PullDownRefresh');
    that.searchLoading = false;

    that.activities = [];
    that.searchPageNum = 1;
    await that.getData();
    wx.stopPullDownRefresh();
  },
  created() {
    this.getData();
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

/*搜索*/
.search {
  flex: auto;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.search-bar {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background: #f4f4f4;
}
.search-wrap {
  position: relative;
  flex: auto;
  display: flex;
  align-items: center;
  height: 80rpx;
  padding: 0 20rpx;
  background: #fff;
  border-radius: 6rpx;
}
.search-wrap .icon-search {
  margin-right: 10rpx;
}
.search-wrap .search-input {
  flex: auto;
  font-size: 28rpx;
}
.search-cancel {
  padding: 0 20rpx;
  font-size: 28rpx;
}

/*搜索结果*/
.search-result {
  flex: auto;
  /* position: relative; */
}
.search-result scroll-view {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
}
.result-item {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20rpx 0 20rpx 110rpx;
  overflow: hidden;
  border-bottom: 2rpx solid #e5e5e5;
}

.result-item .media {
  position: absolute;
  left: 16rpx;
  top: 16rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 999rpx;
}
.result-item .title,
.result-item .subtitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 36rpx;
}
.result-item .title {
  margin-bottom: 4rpx;
  color: #000;
}
.result-item .subtitle {
  color: #808080;
  font-size: 24rpx;
}
.result-item:first-child .subtitle text {
  margin-right: 20rpx;
}
.result-item:not(:first-child) .subtitle text:not(:first-child):before {
  content: "/";
  margin: 0 8rpx;
}
.loading {
  padding: 10rpx;
  text-align: center;
}
.loading:before {
  display: inline-block;
  margin-right: 5rpx;
  vertical-align: middle;
  content: "";
  width: 40rpx;
  height: 40rpx;
  /* background: url(/static/images/icon-loading.gif) no-repeat; */
  background-size: contain;
  animation: rotate 1s linear infinite;
}
.loading.complete:before {
  display: none;
}
</style>
