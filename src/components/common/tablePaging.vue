<template>
  <div class="table-paging-comp" :class="'align-' + position">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="pageSizes"
      :current-page="CURRENTPAGE"
      :page-size="PAGESIZE"
      :total="TOTAL"
      :hide-on-single-page="false"
      :pager-count="PAGERCOUNT"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "tablePaging",
  props: {
    // 位置
    position: {
      default: "right"
    },
    total: {
      // 总页数
      type: Number,
      default: 0
    },
    currentPage: {
      // 当前页
      type: Number,
      default: 1
    },
    pageSize: {
      // 每页显示条数
      type: Number,
      default: 10 // 默认10条
    },
    pagerCount: {
      type: Number,
      default: 5
    },
    pageSizes: {
      default: () => [10, 20, 30, 50]
    },
  },
  data() {
    return {
      CURRENTPAGE: this.currentPage,
      TOTAL: this.total,
      PAGESIZE: this.pageSize,
      PAGERCOUNT: this.pagerCount
    };
  },
  watch: {
    total(val) {
      this.TOTAL = val;
    },
    currentPage(val) {
      this.CURRENTPAGE = val;
    },
    pagerCount(val) {
      this.PAGERCOUNT = val
    },
  },
  methods: {
    handleSizeChange(size) {
      this.PAGESIZE = size;
      this.$emit("handleSizeChange", size);
    },
    handleCurrentChange(page) {
      this.CURRENTPAGE = page;
      this.$emit("handleCurrentChange", page);
    }
  }
};
</script>

<style lang="less" scoped>
.table-paging-comp {
  padding: 20px 10px;
  &.align-right {
    text-align: right;
  }
  &.align-center {
    text-align: center;
  }
  &.align-left {
    text-align: left;
    .el-pagination{
      justify-content: flex-start;
    }
  }
}
</style>
