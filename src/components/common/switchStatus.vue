<!--表格行数据状态-->
<template>
  <div class="table-row-status-comp">
    <el-switch
      :disabled="disabled"
      v-model="scope.row[statusField]"
      :active-value="option.enable.value"
      :inactive-value="option.disable.value"
      :active-text="option.enable.label"
      :inactive-text="option.disable.label"
      active-color="#13ce66"
      @change="openConfirm"
    >
    </el-switch>
  </div>
</template>

<script>
export default {
  name: "switchStatus",
  props: {
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 表格scope
    scope: {
      type: Object,
      default: null
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
    // http apiName
    apiName: {
      type: String,
      default: 'updateStatus'
    },
    // 配置项
    option: {
      type: Object,
      default: {
        enable: {
          label: '启用',
          value: 0,
          message: '是否启用该条数据'
        },
        disable: {
          label: '冻结',
          value: 1,
          message: '是否禁用该条数据'
        },
      }
    }
  },
  data() {
    return {
      status: this.scope.row[this.statusField] || 1
    };
  },
  created() {},
  mounted() {},
  methods: {
    openConfirm(statusCode) {
      let message = '';
      switch (statusCode) {
        case this.option.enable.value:
          message = this.option.enable.message
          break
        case this.option.disable.value:
          message = this.option.disable.message
          break
      }
      this.$confirm(`${message}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        this.scope.row[self.statusField] = statusCode
        this.status = statusCode
        this.setStatus(statusCode);
      })
      .catch(() => {
        // 取消，就要恢复原有状态
        this.$emit('switchBack', true)
        // this.scope.row[this.statusField] = this.status
      })
    },
    // 禁用、启用
    async setStatus(statusCode) {
      const self = this;
      if (!self.$api[self.apiName]) {
        console.log("接口未定义")
        return
      }
      const res = await self.$api[self.apiName]({
        message: "操作成功",
        data: {
          [self.idField]: self.scope.row[self.idField] || self.scope.row.id,
          [self.statusField]: statusCode
        }
      });
      if (res && res.code == 0) {
        self.$emit("change", self.scope.row)
      }
    }
  }
};
</script>

<style lang="less" scoped>

</style>
