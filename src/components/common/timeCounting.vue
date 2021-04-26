<template>
  <span style="color: #ff5454;">{{time}}</span>
</template>

<script>
export default {
  name: "countDown",
  data () {
    return {
      // 最新服务器时间
      updatedServerTime: null,
      // 计数器
      interval: 0,
      // 展示时分秒
      time: '',
      // 销毁计时器的标志
      destroyCount: false,
      // 倒计时暂停（父组件使用）
      countDownPause: false,
      // 正向计时暂停（父组件使用）
      countingPause: false,
      // 暂停状态下+-1min（父组件使用）
      changeWhenPause: 0,
      // 倒计时id
      countDownId: null,
      // 倒计时剩余时间
      leftTime: null,
      // 正向计时id
      countingId: null
    }
  },
  props: {
    // 标的时间
    targetTime: {
	  	type: String,
	  	default: ''
    },
    // 服务器时间
    serverTime: {
      type: String,
	  	default: ''
    },
    // 是否倒计时（true倒计时 false正向计时）
	  isCountDown: {
	  	type: Boolean,
	  	default: true
    },
    // 是否初始即暂停状态
    pause: {
      type: Boolean,
      default: false
    },
    // 已暂停时间（只有设置pause为true时传入）
    pauseInterval: {
      type: String,
      default: ''
    },
    killedBegining: {
      type: [String, Number],
	  	default: ''
    },
    timeLevel: {
      type: Array,
      default: () => ['d', 'h', 'm', 's']
    }
  },
  created() {
    if (this.killedBegining) {
      console.log('暂停')
      // 如果一开始就不执行计时器，暂停状态
      this.time = this.timeProcess(this.killedBegining)
    } else {
      if (this.targetTime == 'blindEnd') {
        this.time = "请结束此赛事"
      } else {
        let that = this
        // that.updateServerTime()
        if (this.isCountDown) {
          // 倒计时
          this.countDownId = setInterval(()=>{
            if(that.destroyCount == true) {
              clearInterval(that.countDownId)
              // 倒计时走完之后，全局使用的计数标志必须置0
              this.interval = 0
            }
            that.timeDown()
          }, 1000)
        } else {
          // 正向计时
          this.countingId = setInterval(() => {
            if(that.destroyCount == true) {
              clearInterval(that.countingId)
              this.interval = 0
            }
            that.timeCounting()
          }, 1000)
        }
      }
    }
  },
  mounted() {
  },
  watch: {
    changeWhenPause(newVal, oldVal) {
      console.log(newVal)
      console.log(oldVal)
      console.log(this.killedBegining)
      if (newVal < oldVal) {
        // 减1min
        this.leftTime = parseInt(this.killedBegining - 1*60)
        this.time = this.timeProcess(this.leftTime)
      } else {
        // 加1min
        this.leftTime = parseInt(this.killedBegining + 1*60)
        this.time = this.timeProcess(this.leftTime)
      }
    },
    // 这里的2个监听，是用来更新计时器所使用的服务期时间的，因为多个计时器一开始使用的serverTime是从父组件统一传入的，一旦有计时器暂停再继续或者有状态切换，需要单独给这个计时器赋予新的服务器时间
    countDownPause(newVal, oldVal) {
      console.log(newVal)
      let that = this
      if (newVal) {
        // pause为true，说明需要暂停倒计时
        clearInterval(this.countDownId)
        // 倒计时走完之后，全局使用的计数标志必须置0
        this.interval = 0
      } else {
        // pause为false，说明需要继续倒计时，需要重新获取服务器时间
        this.$api.getServerTime().then(res => {
          console.log(res)
          if (res && res.code == 0) {
            this.updatedServerTime = res.data
            // console.log(this.serverTime)  // 最老的
            console.log(this.updatedServerTime) // 最新的服务器时间
            console.log(this.targetTime)  // 涨盲执行时间
            // pause为false，说明需要继续倒计时
            this.countDownId = setInterval(()=>{
              if(that.destroyCount == true){
                clearInterval(that.countDownId)
                // 倒计时走完之后，全局使用的计数标志必须置0
                that.interval = 0
              }
              that.timeDown()
            }, 1000)
          }
        })
      }
    },
    countingPause(newVal, oldVal) {
      console.log(newVal)
      if (newVal) {
        clearInterval(this.countingId)
        // 倒计时走完之后，全局使用的计数标志必须置0
        this.interval = 0
      } else {
        // 赛事已进行，一般都是从距赛事开始转过来的
        this.$api.getServerTime().then(res => {
          console.log(res)
          if (res && res.code == 0) {
            this.updatedServerTime = res.data
            // pause为false，说明需要开启正向计时
            this.countingId = setInterval(()=>{
              if(that.destroyCount == true){
                clearInterval(that.countingId)
                // 倒计时走完之后，全局使用的计数标志必须置0
                that.interval = 0
              }
              that.timeCounting()
            }, 1000)
          }
        })
      }
    }
  },
  methods: {
    // 更新服务器时间
    async updateServerTime() {
      let res = await this.$api.getServerTime()
      console.log(res)
      if (res && res.code == 0) {
        this.updatedServerTime = res.data
      }
    },
    destroyTimeDown() {
      // 销毁倒计时
      this.destroyCount = true
    },
    // 正向计时器
		timeCounting() {
      this.interval += 1000
			const targetTime = new Date(this.targetTime)
      // const nowTime = new Date()  // 本地时间(不需要interval)
      // 如果从距赛事开始切换到赛事已进行，需要用最新的服务器时间
      const nowTime = this.updatedServerTime != null ? new Date(this.updatedServerTime) : new Date(this.serverTime) // 服务器时间
			let exceedTime = parseInt((nowTime.getTime()-targetTime.getTime() + this.interval)/1000)  // 秒
			// 何时需要判断终止计时
      this.time = this.timeProcess(exceedTime)
    },
    // 倒计时
    timeDown () {
      this.interval += 1000
      const targetTime = new Date(this.targetTime)
      // const nowTime = new Date()  // 本地时间(不需要interval)
      // 如果是点击继续倒计时，需要用最新的服务器时间
      const nowTime = this.updatedServerTime != null ? new Date(this.updatedServerTime) : new Date(this.serverTime) // 服务器时间
      let leftTime = parseInt((targetTime.getTime()-nowTime.getTime() - this.interval)/1000)  // 秒
      if(leftTime <= 0){
        // 倒计时结束
        this.$emit('timeEnd', true)
        // 结束定时器
        this.destroyCount = true
        // this.time = "请结束此赛事"
      } else {
        this.time = this.timeProcess(leftTime)
        if (leftTime <= 60) {
          // 剩余60s时开始报时
          this.$emit('lessThan60s', leftTime)
        }
      }
    },
    // 将时间戳转换为日期时间
    timeProcess(timestamp) {
      if (timestamp != null && timestamp !== NaN) {
        let d = parseInt(timestamp/(24*60*60))
        let h = this.formate(parseInt(timestamp/(60*60)%24))
        let m = this.formate(parseInt(timestamp/60%60))
        let s = this.formate(parseInt(timestamp%60))
        return `${d}天${h}小时${m}分${s}秒`
      }
    },
    formate (time) {
      if(time>=10){
        return time
      }else{
        return `0${time}`
      }
		}
  }
}
</script>

<style lang="less" scoped>
</style>