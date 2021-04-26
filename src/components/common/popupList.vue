<template>
  <div class="container">
    <div class="search">
      <!--搜索栏 !-->
      <search-bar
        ref="searchForm"
        @search="search"
        :options="options"
        :total="total"
        labelWidth="6em"
      >
      </search-bar>
    </div>
    <div class="tb-bd">
      <public-table class="mt10" :columns="columns" :tableData="tableData" :isMultiple="false" 
										@selectionChange="handleSelectionChange">
        <!-- 插槽 v-slot:{columns配置的slotName}-->
        <template v-slot:status="data">
          <el-switch
            v-model="data.scopeRow.status"
            active-color="#13ce66"
            inactive-color="#ccc">
          </el-switch>
        </template>
        <template v-slot:operation="data" v-if="false">
          <el-button type="success" size="mini" @click="release(data.scopeRow)" :disabled="data.scopeRow.status!==1">发布</el-button>
          <el-button type="primary" size="mini" @click="view(data.scopeRow)">查看</el-button>
          <!-- 
            状态
            0待分配（可删）
            1已分配/未发布（可删）
            5未发布
            6已发布/未开赛（可删）
            7进行中暂停
            8进行中
            9已结束
            2已过期

            子赛事
            3已关联
            10进行中
            11已结束
            4删除
          -->
          <el-button type="warning" size="mini" @click="remove(tableData, data.scopeData, data.scopeRow)" :disabled="data.scopeRow.status!==0&&data.scopeRow.status!==1&&data.scopeRow.status!==6">删除</el-button>
        </template>
      </public-table>
      <table-paging
        position="right"
        :total="total"
        :currentPage="1"
        :pageSize="10"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-paging>
    </div>
  </div>
</template>

<script>
// import mixins from './mixins'
import moment from "moment"
/**
 * 状态
 * 0待分配
 * 1已分配/未发布
 *     6已发布/未开赛
 *        8进行中
 *        9已结束
 * 2已过期
 * 3已关联
 *     10进行中
 *     11已结束
 * 4删除
 */
const statusOptions = [
  {label: '未发布', value: 1},
  {label: '未开赛', value: 6},
  {label: '进行中', value: 8},
  {label: '已结束', value: 9},
  {label: '已过期', value: 2},
]
export default {
  name: 'storeMatchList',
  // mixins: [mixins],
  data() {
    return {
      params: {
        "page": 1,
        "pageSize": 10,
        "param":{
          // "matchId":0,
          // "type":0,
          // "matchName":"",
          // "status":-1,
          // "storeId":0,
          // "startTime":""
        }
      },
      options: [
        {
          type: 'datepicker-range',
          prop: "releaseTime",
          value: "",
          title: "发布时间",
          placeholder: ['开始时间', '结束时间'],
        },
        {
          title: "赛事编号",
          prop: "matchId",
          type: "input",
          value: "",
        },
        {
          title: "赛事系列",
          prop: "templateId",
          type: "select",
          value: "",
          options: [],
          setProps: {
            key: 'templateId',
            label: 'matchName'
          }
        },
        {
          title: "赛事名称",
          prop: "matchName",
          type: "input",
          value: "",
        },
        {
          title: "赛事类型",
          prop: "type",
          type: "select",
          value: "",
          options: [
            {label: 'MTT', value: 1},
            {label: 'SNG', value: 2},
          ]
        },
        {
          title: "状态",
          prop: "status",
          type: "select",
          value: "",
          options: [
            {label: '未发布', value: 1},
            {label: '未开赛', value: 6},
            {label: '进行中', value: 8},
            {label: '已结束', value: 9},
          ]
        },
      ],
      total: 0,
			tableData: [],
			selectRes: []
    }
  },
  props: {
		apiName: {
			type: String,
			default: ''
		},
		query: {
			type: Object,
			default: function () {
				return {}
			}
		},
		columns: {
			type: Array,
			default: function () {
				return []
			}
		}
	},
  created () {
		this.params.param = this.query
    this.getList()
  },
  methods: {
		handleSelect(selection) {
			// 当用户手动勾选数据行的 Checkbox 时触发的事件
			this.selectRes = []
			console.log(selection)
			this.selectRes = selection
			this.$emit('selectRes', this.selectRes)
		},
		handleSelectionChange(selections) {
			console.log('当选择项发生变化时会触发该事件', selections)
			// 当用户手动勾选数据行的 Checkbox 时触发的事件
			this.selectRes = []
			this.selectRes = selections
			this.$emit('selectRes', this.selectRes)
		},
		handleSizeChange(val) {
			console.log(val)
			this.params.pageSize = val
			this.getList()
		},
		handleCurrentChange(val) {
			console.log(val)
			this.params.page = val
			this.getList()
		},
		async getList() {
			console.log(this.apiName)
			console.log(this.query)
			const pageType = this.query.type
			const res = await this.$api[this.apiName]({
        data: {
          ...this.params
        }
      })
      if (res && res.code === 0) {
        this.tableData = res.data.records || []
				this.total = res.data.total
				// 处理数据应该放到父组件中
        this.tableData.forEach(item => {

					// 关联页面类型
					switch (pageType) {
						case 1:
							break
						case 2:
							// 热门资讯2
						case 3:
							// 品牌信息3
							// 发布状态
							if ('status' in item) {
								item.status = ['待发布', '已发布', '已下架'][item.status]
							}
							// 信息类型
							if ('type' in item) {
								item.type = ['Banner', '系统消息', '热门资讯', '管理规范'][item.type]
							}
							// 是否弹窗
							if ('isPopup' in item) {
								item.isPopup = ['否', '是'][item.isPopup]
							}
							break
						default:
							// query为空对象，才是热门赛事
							// 赛事类型
							if ('type' in item) {
								item.type = ['MTT', 'SNG'][item.type-1]
							}
							// 报名金额
							if ('itemCount' in item) {
								item.itemCount = (item.itemCount / 100) .toFixed(2)
							}
							if (item.itemId === 10000) {
            		item.matchWay = '红分'
							}
							break
					}
          // if ('level' in item) {
          //   item.level = levelOptions.find(option => option.value === item.level).label
          // }
        })
      }
		},
    search(form) {
      this.params.param = form
      if (form.releaseTime) {
        this.params.param.releaseStartTime = moment(form.releaseTime[0]).format('YYYY-MM-DD HH:mm:ss')
        this.params.param.releaseEndTime = moment(form.releaseTime[1]).format('YYYY-MM-DD HH:mm:ss')
      } else {
        delete this.params.param.releaseStartTime
        delete this.params.param.releaseEndTime
      }
      delete this.params.param.releaseTime
      this.getList()
    },
    release(item) {
      this.$router.push({
        name: 'raceExecution',
        query: {
          matchId: item.matchId,
          type: item.type
        }
      })
    },

  }
}
</script>

<style lang="less" scoped>
  .tb-bd{
    padding: 15px;
  }
</style>

