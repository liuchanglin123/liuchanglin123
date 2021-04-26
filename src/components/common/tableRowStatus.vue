<!--表格行数据状态-->
<template>
  <div class="table-row-status-comp">
    <!--启用、激活-->
    <el-button
      size="mini"
      type="primary"
      v-if="option.enable"
      @click="openConfirm(option.enable.label, option.enable.value)"
      :disabled="disabled || option.enable.disabled || scope.row[statusField] == option.enable.value"
    >{{option.enable.label}}</el-button>
    <!--禁用、冻结-->
    <el-button
      size="mini"
      type="warning"
      v-if="option.disable"
      @click="openConfirm(option.disable.label, option.disable.value)"
      :disabled="disabled || option.disable.disabled || scope.row[statusField] == option.disable.value"
    >{{option.disable.label}}</el-button>
    <!--注销、删除-->
    <el-button
      size="mini"
      type="danger"
      v-if="option.logout"
      @click="openConfirm(option.logout.label, option.logout.value, -1)"
      :disabled="disabled || option.logout.disabled || scope.row[statusField] == option.logout.value"
    >{{option.logout.label}}</el-button>
  </div>
</template>

<script>
export default {
  name: "tableRowStatus",
  props: {
    // 表格数据
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    // 表格scope
    scope: {
      type: Object,
      default: null
    },
    // 表格当前行名称
    rowName: {
      type: String,
      default: "本条数据"
    },
    // id字段名
    idField: {
      type: String,
      default: "id"
    },
    // 状态字段名称
    statusField: {
      type: String,
      default: "status"
    },
    // 状态选项
    option: {
      type: Object,
      default: null
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 拦截器
    interceptor: {
      type: Object,
      default() {
        return {
          message: "拦截操作",
          intercept: false
        };
      }
    }
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    openConfirm(label, statusCode, type) {
      if (this.interceptor.intercept) {
        this.$message.error(this.interceptor.message);
        return;
      }
      this.$confirm(`确定要${label}${this.rowName}? `, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (type == -1) {
            this.logout();
            return;
          }
          this.setStatus(statusCode);
        })
        .catch(() => {
          // 取消
        });
    },
    // 禁用、启用
    async setStatus(statusCode) {
      const self = this;
      if (!self.$api[self.option.enable.apiName]) {
        console.log("接口未定义");
        return;
      }
      const res = await self.$api[self.option.enable.apiName]({
        message: "操作成功",
        data: {
          [self.idField]: self.scope.row[self.idField] || self.scope.row.id,
          [self.statusField]: statusCode
        }
      });
      if (res && res.code == 0) {
        self.scope.row[self.statusField] = statusCode;
        self.$emit("change", self.scope.row);
      }
    },
    // 注销、删除
    async logout() {
      const self = this;
      if (!self.$api[self.option.logout.apiName]) {
        console.log("接口未定义");
        return;
      }
      const res = await self.$api[self.option.logout.apiName]({
        message: "操作成功",
        data: {
          [self.idField]: self.scope.row[self.idField] || self.scope.row.id,
          [self.statusField]: self.option.logout.value
        }
      });
      if (res && res.code == 0) {
        self.scope.row[self.statusField] = self.option.logout.value;
        self.tableData.splice(self.scope.$index, 1);
        self.$emit("change", self.scope.row);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.table-row-status-comp .el-button {
  margin: 0 5px;
}
</style>
