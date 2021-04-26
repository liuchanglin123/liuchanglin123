<template>
  <div class="public-form">
    <el-form :inline="true" :model="form" :label-width="labelWidth" size="medium" :rules="rules">
      <div v-for="(formItem, itemIndex) in options" :key="itemIndex" class="form-item-line">
        <el-form-item :label="formItem.title" v-if="formItem.type === 'input'" :prop="formItem.rules ? formItem.prop : ''">
          <el-input
            v-model.trim="form[formItem.prop]"
            :placeholder="`请输入${formItem.title}`"
            :disabled="disabled || formItem.disabled || false"
            :maxlength="formItem.maxlength || 50"
            @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="formItem.title"
          v-show="formItem.show==false?formItem.show:true"
          v-if="formItem.type === 'select'"
          :prop="formItem.rules ? formItem.prop : ''"
        >
          <el-select
            filterable
            clearable
            v-model="form[formItem.prop]"
            :placeholder="`请选择${formItem.title}`"
            :disabled="disabled || formItem.disabled || false"
            :remote-method="typeof formItem.remoteMethod === 'function' ? formItem.remoteMethod : null"
            @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
          >
            <el-option
              :label="optionItem[(formItem.setProps && formItem.setProps.label) || 'label']"
              :value="optionItem[(formItem.setProps && formItem.setProps.key) || 'value']"
              v-for="(optionItem, optionIndex) in formItem.options"
              :key="optionIndex"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="formItem.title" v-if="formItem.type === 'minMax'" class="min-max" :prop="formItem.rules ? formItem.prop : ''">
          <el-input
            v-model.trim="form[formItem.options[0]]"
            type="text"
            v-enterTxt
            placeholder="输入最小值"
            maxlength="10"
          ></el-input>
          <span v-if="formItem.type=='minMax'" class="siding-flag">—</span>
          <el-input
            v-enterTxt
            v-model.trim="form[formItem.options[1]]"
            type="text"
            placeholder="输入最大值"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item :label="formItem.title" v-if="formItem.type === 'datepicker'" :prop="formItem.rules ? formItem.prop : ''">
          <el-date-picker
            v-model="form[formItem.prop]"
            type="date"
            :picker-options="formItem.pickerOptions || null"
            :placeholder="`请选择${formItem.title}`"
            :disabled="disabled || formItem.disabled || false"
            @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="formItem.title" v-if="formItem.type === 'datepicker-range'" :prop="formItem.rules ? formItem.prop : ''">
          <el-date-picker
            v-model="form[formItem.prop]"
            type="daterange"
            :picker-options="formItem.pickerOptions || null"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :disabled="disabled || formItem.disabled || false"
            @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="formItem.title" v-if="formItem.type === 'datetime'" :prop="formItem.rules ? formItem.prop : ''">
          <el-date-picker
            v-model="form[formItem.prop]"
            type="datetime"
            :picker-options="formItem.pickerOptions || null"
            :placeholder="`请选择${formItem.title}`"
            :disabled="disabled || formItem.disabled || false"
            @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="formItem.title" v-if="formItem.type === 'datetime-range'" :prop="formItem.rules ? formItem.prop : ''">
          <el-date-picker
            v-model="form[formItem.prop]"
            type="datetimerange"
            :picker-options="formItem.pickerOptions || null"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :disabled="disabled || formItem.disabled || false"
            @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="formItem.title" v-if="formItem.type === 'year'" :prop="formItem.rules ? formItem.prop : ''">
          <el-date-picker
            v-model="form[formItem.prop]"
            type="year"
            :picker-options="formItem.pickerOptions || null"
            :placeholder="`请选择${formItem.title}`"
            :disabled="disabled || formItem.disabled || false"
            @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="formItem.title" v-if="formItem.type === 'month'" :prop="formItem.rules ? formItem.prop : ''">
          <el-date-picker
            v-model="form[formItem.prop]"
            type="month"
            :picker-options="formItem.pickerOptions || null"
            :placeholder="`请选择${formItem.title}`"
            :disabled="disabled || formItem.disabled || false"
            @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="formItem.title" v-if="formItem.type === 'cascader'" :prop="formItem.rules ? formItem.prop : ''">
          <el-cascader
            v-model="form[formItem.prop]"
            :value="formItem.value"
            :props="formItem.setProps"
            :options="formItem.options"
            :placeholder="`请选择${formItem.title}`"
            :disabled="disabled || formItem.disabled || false"
            @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
          ></el-cascader>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>

export default {
  name: "publicForm",
  props: {
    disabled: {
      default: false
    },
    // 配置参数
    options: {
      default() {
        return [
          //   {
          //     title: '表单名称', // 表单名
          //     prop: 'name', // 表单字段
          //     type: 'input', // 表单类型
          //     value: '', // 表单字段值
          //     options: [{ // select类型表单选项
          //       value: '', // 字段值
          //       label: '' // 字段名
          //     },
          //   ]
          // }
        ];
      }
    },
    // 标签宽度
    labelWidth: {
      default: "70px"
    }
  },
  data() {
    return {
      form: {},
    };
  },
  computed: {
    rules() {
      let rules = {}
      this.options.forEach(option => {
        if (option.rules && Array.isArray(option.rules)) {
          rules[option.prop] = option.rules
        }
      })
      return rules
    }
  },
  watch: {
    form: {
      handler(newVal, oldVal) {
        this.$emit("change", newVal, oldVal);
      },
      deep: true
    }
  },
  created() {

  },
  mounted() {

  },
  destroyed() {

  },
  methods: {


  },

}
</script>

<style lang="less">
.public-form{
  padding: 15px 10px;
  .el-form {
    background-color: #fff;
    .el-button--text:hover {
      background-color: transparent;
      color: #57a3f3;
      border-color: transparent;
    }
    .el-button--text:focus {
      background-color: transparent;
      color: #57a3f3;
      border-color: transparent;
    }
  }
  .form-item-line {
    .el-form-item {
      position: relative;
    }
  }
  .el-input__inner {
    width: 360px;
  }
  .el-input {
    width: auto;
  }
}
</style>
