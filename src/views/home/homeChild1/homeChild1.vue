<template>
  <div>
    <div class="search">
      <!--搜索栏 !-->
      <search-bar
        @search="search"
        :options="options"
        :total="total"
        labelWidth="6em"
      >
        <control-bar slot="extend-bar" @select="select" :options="controlOptions"></control-bar>
      </search-bar>
    </div>
    <div class="tb-bd">
      <public-table class="mt10" :columns="columns" :tableData="tableData">
        <!-- 插槽 v-slot:{columns配置的slotName}-->
        <template v-slot:status="data">
          <table-row-status
            :scope="data.scopeData"
            idField="id"
            statusField="status"
            :rowName="data.scopeRow.name"
            :option="{
              enable: {
                label: '启用',
                apiName: 'apiName',
                value: '0'
              },
              disable: {
                label: '冻结',
                apiName: 'apiName',
                value: '1'
              },
              logout: {
                label: '注销',
                apiName: 'apiName',
                value: '-1'
              }
            }"
          >
          </table-row-status>
        </template>
        <template v-slot:operation="data">
          <el-button type="text" size="small" @click="view(data.scopeRow.name)">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </public-table>
      <table-paging
        position="right"
        :total="999"
        :currentPage="1"
        :pageSize="10"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-paging>
    </div>
  </div>
</template>

<script>
export default {
  name: 'homeChild1',
  data() {
    return {
      controlOptions: [
        {
          name: "新增用户",
          type: "primary",
          icon: "plus",
        }
      ],
      options: [
        {
          title: "用户账号",
          prop: "account",
          type: "input",
          value: "",
        },
        {
          title: "姓名",
          prop: "userName",
          type: "input",
          value: "",
        },
        {
          title: "所属机构",
          prop: "insId",
          type: "cascader",
          setProps: {
            value: "id",
            label: "text",
            checkStrictly: true,
            children: "children"
          },
          options: [],
          value: "",
        },
        {
          title: "用户角色",
          prop: "roleName",
          type: "input",
          value: "",
        },
        {
          title: "手机号码",
          prop: "mobile",
          type: "input",
          value: "",
          // rules: [
          //   {pattern: /^1[3456789]\d{9}$/, message: '手机号输入有误', loose: true} // loose为false则空值不校验
          // ]
        },
        {
          title: "用户状态",
          prop: "userStatus",
          type: "select",
          options: [
            { value: 0,label: "启用" },
            { value: 1,label: "冻结" }
          ],
          value: "",
        },
        {
          type: "datepicker-range",
          prop: "createTime",
          value: "",
          title: "创建时间",
          placeholder: ["开始时间", "结束时间"]
        }
      ],
      total: 0,
      columns: [
        {
          type: 'selection',
          fixed: 'left',
          width: 50
        },
        {
          label: '序号',
          type: 'index',
          fixed: 'left',
          width: 80
        },
        {
          prop: 'date',
          label: '日期',
          minWidth: 150
        },
        {
          prop: 'name',
          label: '姓名'
        },
        {
          prop: 'address',
          label: '地址',
          minWidth: 260
        },
        {
          label: '操作',
          hasScope: true,
          slotName: 'operation',
          minWidth: 150
        },
        {
          label: '状态',
          hasScope: true,
          slotName: 'status',
          minWidth: 260
        }
      ],
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ]
    }
  },
  created () {

  },
  methods: {
    search() {

    },
    select(val) {
      console.log('select-val', val)
    },
    view(name) {
      console.log('查看' + name)
    },
    handleSizeChange(pageSize) {
      console.log(pageSize);
    },
    handleCurrentChange(currentPage) {
      console.log(currentPage);
    },
  }
}
</script>

<style lang="less" scoped>
  .tb-bd{
    padding: 15px;
  }
</style>
