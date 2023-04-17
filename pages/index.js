// pages/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [
      [1, 2, 3, 4, 5, 6],
      [1, 2, 3, 4, 5, 6],
      [1, 2, 3, 4, 5, 6],
      [1, 2, 3, 4, 5, 6],
      [1, 2, 3, 4, 5, 6]
    ],
    multiSelect: [],
    initList: [{
        name: '玩家一',
        one: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0,
        six: 0,
        littleSum: 0,
        rewards: 0,
        allSelect: 0,
        fourSame: 0,
        gourd: 0,
        miniStraight: 0,
        bigStraight: 0,
        yahtzee: 0,
        totalScore: 0
      },
      {
        name: '玩家二',
        one: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0,
        six: 0,
        littleSum: 0,
        rewards: 0,
        allSelect: 0,
        fourSame: 0,
        gourd: 0,
        miniStraight: 0,
        bigStraight: 0,
        yahtzee: 0,
        totalScore: 0
      },
      {
        name: '玩家三',
        one: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0,
        six: 0,
        littleSum: 0,
        rewards: 0,
        allSelect: 0,
        fourSame: 0,
        gourd: 0,
        miniStraight: 0,
        bigStraight: 0,
        yahtzee: 0,
        totalScore: 0
      }
    ],
    dict: {
      '1': 'one',
      '2': 'two',
      '3': 'three',
      '4': 'four',
      '5': 'five',
      '6': 'six',
      '7': 'allSelect',
      '8': 'fourSame',
      '9': 'gourd',
      '10': 'miniStraight',
      '11': 'bigStraight',
      '12': 'yahtzee',
    },
    scoreList: [],
    curIndex: 0,
    activeNum: 0,
    confirm: false
  },
  bindMultiPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    let multiSelect = e.detail.value.map(item => {
      return item + 1
    })
    this.setData({
      multiSelect: multiSelect,
      multiIndex: e.detail.value,
      confirm: false,
      activeNum: 0
    })
  },
  // 固定点数累加
  numSum(e) {
    if(this.data.confirm || !this.data.multiSelect.length) return
    let {
      num,
      index
    } = e.target.dataset
    if(this.data.curIndex != index || this.data.activeNum != num) {
      if(this.data.activeNum) {
        let score = 'scoreList[' + this.data.curIndex + '].' + this.data.dict[this.data.activeNum]
        this.setData({
          [score]: 0,
          activeNum: 0
        })
      }
    }else {
      this.setData({
        confirm: true
      })
    }
    this.setData({
      curIndex: index,
      activeNum: num
    })
    let numSum = this.data.multiSelect.reduce((pre, cur, index) => {
      if (pre != num && index == 1) {
        pre = 0
      }
      if (cur == num) {
        return pre + cur
      } else {
        return pre
      }
    })
    let score = 'scoreList[' + index + '].' + this.data.dict[num]
    this.setData({
      [score]: numSum
    })
    this.littleSum(this.data.scoreList[index], index)
    this.countTotal(this.data.scoreList[index],index)
  },
  // 小计
  littleSum(item, index) {
    let littleSum = `scoreList[${index}].littleSum`
    this.setData({
      [littleSum]: item.one + item.two + item.three + item.four + item.five + item.six
    })
    let rewards = `scoreList[${index}].rewards`
    if (this.data.scoreList[index].littleSum > 63) {
      this.setData({
        [rewards]: 35
      })
    }else {
      this.setData({
        [rewards]: 0
      })
    }
  },
  // 全选
  allSelect(e) {
    let index = e.target.dataset.index
    let pointsSum = this.data.multiSelect.reduce((pre, cur) => {
      return pre + cur
    })
    let allSelect = `scoreList[${index}].allSelect`
    this.setData({
      [allSelect]: pointsSum
    })
    this.littleSum(this.data.scoreList[index], index)
    this.countTotal(this.data.scoreList[index],index)
  },
  // 计算出现最多相同的点数有多少个
  findMost(arr) {
    if (arr.length == 1) {
      return 1
    }
    let obj = {} 
    let maxName;
    let maxNum = 0;
    arr.forEach((item, index) => {
      obj[item] ? obj[item] += 1 : obj[item] = 1
    })
    for (let ite in obj) {
      if (obj[ite] > maxNum) {
        maxNum = obj[ite]
        maxName = ite
      }
    }
    console.log("出现次数最多的是：" + maxName + ",出现的次数为：" + maxNum)
    return maxNum
  },
  // 点数累加
  allSum(index,prop,flag) {
    let pointsSum = this.data.multiSelect.reduce((pre, cur) => {
      return pre + cur
    })
    let propName = `scoreList[${index}].${prop}`
    if(flag) {
      this.setData({
        [propName]: pointsSum
      })
    }else {
      this.setData({
        [propName]: 0
      })
    }
    this.littleSum(this.data.scoreList[index], index)
    this.countTotal(this.data.scoreList[index],index)
  },
  // 计算点数相同情况
  countSame(e) {
    let {index, prop, num} = e.target.dataset
    if(this.data.confirm || !this.data.multiSelect.length) return
    if(this.data.curIndex != index || this.data.activeNum != num) {
      let score = 'scoreList[' + this.data.curIndex + '].' + this.data.dict[this.data.activeNum]
        this.setData({
          [score]: 0,
          activeNum: 0
      })
    }else {
      this.setData({
        confirm: true
      })
    }
    this.setData({
      curIndex: index,
      activeNum: num
    })
    let arr = [0, 0, 0, 0, 0, 0];
    let list = this.data.multiSelect
    for (let i = 0; i < list.length; i++) {
      arr[list[i] - 1]++;
    }
    let exist5 = false,
      exist4 = false,
      exist3 = false,
      exist2 = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === 3) {
        exist3 = true;
      } else if (arr[i] === 2) {
        exist2 = true;
      } else if (arr[i] === 4) {
        exist4 = true
      }else if(arr[i] === 5) {
        exist5 = true
      }
    }
    let flag
    switch(prop) {
      case 'fourSame':
        flag = exist4 || exist5
        this.allSum(index,'fourSame',flag)
        break;
      case 'gourd':
        flag = (exist2 && exist3) || exist5
        this.allSum(index,'gourd',flag)
        break;
      case 'yahtzee':
        let propName = `scoreList[${index}].${prop}`
        if(exist5) {
          this.setData({
            [propName]: 50
          })
        }else {
          this.setData({
            [propName]: 0
          })
        }
        break;
      default:
        this.allSum(index,'allSelect',true)
    }
  },
  // 四骰同花
  fourSame(e) {
    let index = e.target.dataset.index
    let sameNumber = this.findMost(this.data.multiSelect)
    let fourSame = `scoreList[${index}].fourSame`
    if (sameNumber >= 4) {
      let pointsSum = this.data.multiSelect.reduce((pre, cur) => {
        return pre + cur
      })
      this.setData({
        [fourSame]: pointsSum
      })
    } else {
      this.setData({
        [fourSame]: 0
      })
    }
  },
  // 判断大小顺
  judgeStraight(e) {
    let {index, prop, num} = e.target.dataset
    if(this.data.confirm || !this.data.multiSelect.length) return
    if(this.data.curIndex != index || this.data.activeNum != num) {
      let score = 'scoreList[' + this.data.curIndex + '].' + this.data.dict[this.data.activeNum]
        this.setData({
          [score]: 0,
          activeNum: 0
      })
    }else {
      this.setData({
        confirm: true
      })
    }
    this.setData({
      curIndex: index,
      activeNum: num
    })
    let list = this.data.multiSelect.slice().sort()
    let count = 1
    list.reduce((pre,cur)=> {
      if(cur-pre === 1) {
        count ++
      }else if(cur -pre > 1) {
        count = 1
      }
      return cur
    })
    let propName = `scoreList[${index}].${prop}`
    if(prop == 'miniStraight' && count >= 4) {
      this.setData({
        [propName]: 15
      })
    }else if(prop == 'bigStraight' && count == 5) {
      this.setData({
        [propName]: 30
      })
    }else {
      this.setData({
        [propName]: 0
      })
    }
    this.littleSum(this.data.scoreList[index], index)
    this.countTotal(this.data.scoreList[index],index)
  },
  // 计算总点数
  countTotal(item,index) {
    let total = `scoreList[${index}].totalScore`
    this.setData({
      [total]: item.littleSum+item.rewards+item.allSelect+item.fourSame+item.gourd+item.miniStraight+item.bigStraight+item.yahtzee
    })
  },
  // 重置
  reset() {
    this.setData(({
      confirm: false,
      scoreList: JSON.parse(JSON.stringify(this.data.initList))
    }))
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      scoreList: JSON.parse(JSON.stringify(this.data.initList))
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})