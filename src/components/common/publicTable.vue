<template>
  <el-table 
    ref="publicTable"
    :data="TABLEDATA"
    border
    class="table" 
    @select="handleSelect" 
    @select-all="handleSelectAll" 
    @selection-change="handleSelectionChange" 
    @row-click="handleRowClick"
    @expand-change="handleExpandChange"
  >
    <div class="column-item" v-for="(column, i) in columns" :key="i">
      <el-table-column
        v-if="!column.hasScope"
        :type="column.type || ''"
        :selectable="isSelectable"
        :fixed="column.fixed || false"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :align="column.align || 'center'"
      >
      </el-table-column>
      <el-table-column
        v-else
        :type="column.type || ''"
        :selectable="isSelectable"
        :fixed="column.fixed || false"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :align="column.align || 'center'"
      >
        <template slot-scope="scope">
          <slot :name="column.slotName" :scopeData="scope" :scopeRow="scope.row"></slot>
        </template>
      </el-table-column>
    </div>
    
  </el-table>
</template>

<script>
export default {
  name: 'publicTable',
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    // 是否可多选
    isMultiple: {
      type: Boolean,
      default: true
    },
    // rowKey: {
    //   type: [Number, String],
    //   default: ''
    // },
    // checkbox是否可以选择（默认可选）
    isSelectable: {
      type: Function,
      default: () => {
        return true
      }
    }
  },
  data() {
    return {

    }
  },
  computed: {
    TABLEDATA() {
      return this.tableData
    }
  },
  methods: {
    handleRowClick(row, column, event) {
      console.log(row)
      this.$emit('handleRowClick', row)
    },
    handleExpandChange(row, expandedRows) {
      console.log('row', row)
      this.$emit('handleExpandChange', row)
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    handleSelect(selection, row) {
      console.log(selection)
      console.log(row)
      this.$emit('handleSelect', selection)
    },
    // 当用户手动勾选全选 Checkbox 时触发的事件
    handleSelectAll(selection) {
      console.log(selection)
      // 如果是单选，要使全选功能失效
      if (!this.isMultiple) {
        this.$refs.publicTable.clearSelection()
        this.$message.warning('只可单选')
      }
    },
    // 当选择项发生变化时会触发该事件
    handleSelectionChange(selections) {
      console.log(selections)
      
      // 如果是单选才执行
      if (!this.isMultiple) {
        if (selections.length > 1) {
          // 多选>1 先清除所有，再将最后一个选中
          this.$refs.publicTable.clearSelection()
          // 删除并返回数组的最后一个元素即最后选中的
          let lastSelection = selections.pop()
          this.$refs.publicTable.toggleRowSelection(lastSelection, true)
        } else {
        }
      }

      this.$emit('selectionChange', selections)
    }
  }
}
</script>

<style lang="less" scoped>
  .table{
    min-width: 100%;
  }
</style>
