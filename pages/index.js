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
        totalScore: 0,
        oneConfirmed: false,
        twoConfirmed: false,
        threeConfirmed: false,
        fourConfirmed: false,
        fiveConfirmed: false,
        sixConfirmed: false,
        allSelectConfirmed: false,
        fourSameConfirmed: false,
        gourdConfirmed: false,
        miniStraightConfirmed: false,
        bigStraightConfirmed: false,
        yahtzeeConfirmed: false
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
        totalScore: 0,
        oneConfirmed: false,
        twoConfirmed: false,
        threeConfirmed: false,
        fourConfirmed: false,
        fiveConfirmed: false,
        sixConfirmed: false,
        allSelectConfirmed: false,
        fourSameConfirmed: false,
        gourdConfirmed: false,
        miniStraightConfirmed: false,
        bigStraightConfirmed: false,
        yahtzeeConfirmed: false
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
    confirm: false,
    currentPlayer: 0,
    roundNumber: 1,
    totalRounds: 12,
    diceList: [0, 0, 0, 0, 0],
    rolling: false,
    hintMessage: '欢迎进入游戏，先投掷骰子再选择当前玩家得分项。'
  },
  rollDice() {
    if (this.data.rolling) return

    this.setData({
      rolling: true,
      confirm: false,
      activeNum: 0,
      diceList: [0, 0, 0, 0, 0],
      hintMessage: '骰子投掷中，请稍候...'
    })

    const timerCount = 12
    let count = 0

    const interval = setInterval(() => {
      const randomDice = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1)
      this.setData({
        diceList: randomDice
      })
      count++
      if (count >= timerCount) {
        clearInterval(interval)
        const finalDice = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1)
        this.setData({
          rolling: false,
          multiSelect: finalDice,
          diceList: finalDice,
          hintMessage: '骰子已掷出，请点击当前玩家对应得分格选择项，再次点击确认得分。'
        })
      }
    }, 100)
  },
  // 切换到下一个玩家
  nextPlayer() {
    const nextPlayer = (this.data.currentPlayer + 1) % this.data.scoreList.length
    const nextRound = nextPlayer === 0 ? this.data.roundNumber + 1 : this.data.roundNumber
    this.setData({
      currentPlayer: nextPlayer,
      roundNumber: nextRound,
      confirm: false,
      activeNum: 0,
      curIndex: nextPlayer,
      hintMessage: `轮到${this.data.scoreList[nextPlayer].name}，请先投掷骰子。`
    })
  },

  // 固定点数累加
  numSum(e) {
    if(this.data.confirm || !this.data.multiSelect.length) return
    let {
      num,
      index
    } = e.target.dataset
    if (index !== this.data.currentPlayer) return
    const willConfirm = this.data.curIndex === index && this.data.activeNum === num
    const label = `${num}点`
    const playerName = this.data.scoreList[index].name
    if(this.data.curIndex != index || this.data.activeNum != num) {
      if(this.data.activeNum) {
        let score = 'scoreList[' + this.data.curIndex + '].' + this.data.dict[this.data.activeNum]
        this.setData({
          [score]: 0,
          activeNum: 0
        })
      }
      this.setData({
        confirm: false,
        curIndex: index,
        activeNum: num,
        hintMessage: `已选择${label}，再点击一次确认${playerName}得分`
      })
    } else {
      const confirmedField = 'scoreList[' + index + '].' + this.data.dict[num] + 'Confirmed'
      this.setData({
        confirm: true,
        hintMessage: `已确认${label}，正在切换到下一位玩家`,
        [confirmedField]: true
      })
    }
    let numSum = this.data.multiSelect.reduce((pre, cur, idx) => {
      if (pre != num && idx == 1) {
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
    if (willConfirm) {
      this.nextPlayer()
    }
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
    if (index !== this.data.currentPlayer) return
    const willConfirm = this.data.curIndex === index && this.data.activeNum === num
    const labelMap = {
      7: '全选',
      8: '四骰同花',
      9: '葫芦',
      12: '快艇'
    }
    const label = labelMap[num] || `${num}点`
    const playerName = this.data.scoreList[index].name
    if(this.data.curIndex != index || this.data.activeNum != num) {
      const score = this.data.activeNum ? 'scoreList[' + this.data.curIndex + '].' + this.data.dict[this.data.activeNum] : null
      const update = {
        confirm: false,
        curIndex: index,
        activeNum: num,
        hintMessage: `已选择${label}，再点击一次确认${playerName}得分`
      }
      if (score) {
        update[score] = 0
      }
      this.setData(update)
    } else {
      const confirmedField = 'scoreList[' + index + '].' + this.data.dict[num] + 'Confirmed'
      this.setData({
        confirm: true,
        hintMessage: `已确认${label}，正在切换到下一位玩家`,
        [confirmedField]: true
      })
    }
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
        this.countTotal(this.data.scoreList[index],index)
        break;
      default:
        this.allSum(index,'allSelect',true)
    }
    if (willConfirm) {
      this.nextPlayer()
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
    if (index !== this.data.currentPlayer) return
    const willConfirm = this.data.curIndex === index && this.data.activeNum === num
    const label = prop === 'miniStraight' ? '小顺' : '大顺'
    const playerName = this.data.scoreList[index].name
    if(this.data.curIndex != index || this.data.activeNum != num) {
      const score = this.data.activeNum ? 'scoreList[' + this.data.curIndex + '].' + this.data.dict[this.data.activeNum] : null
      const update = {
        confirm: false,
        curIndex: index,
        activeNum: num,
        hintMessage: `已选择${label}，再点击一次确认${playerName}得分`
      }
      if (score) {
        update[score] = 0
      }
      this.setData(update)
    } else {
      const confirmedField = 'scoreList[' + index + '].' + this.data.dict[num] + 'Confirmed'
      this.setData({
        confirm: true,
        hintMessage: `已确认${label}，正在切换到下一位玩家`,
        [confirmedField]: true
      })
    }
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
    if (willConfirm) {
      this.nextPlayer()
    }
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
      scoreList: JSON.parse(JSON.stringify(this.data.initList)),
      currentPlayer: 0,
      roundNumber: 1,
      diceList: [0, 0, 0, 0, 0],
      rolling: false,
      multiSelect: [],
      curIndex: 0,
      activeNum: 0,
      hintMessage: '已重置，先投掷骰子开始游戏。'
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