//添加事件结束
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
}

const request = (url, method, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'content-type': 'application/json',
        'version': '1.0'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          resolve(res); //返回成功提示信息
        } else {
          reject(res.data.message); //返回错误提示信息
        }
      },
      fail: function (res) {
        reject("网络连接错误"); //返回错误提示信息
      },
      complete: function (res) {

      }
    })
  });
}

function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}


export default {
  formatNumber,
  formatTime,
  request: request
}
