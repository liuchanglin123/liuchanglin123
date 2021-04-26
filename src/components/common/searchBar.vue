<template>
  <div class="search-bar-comp">
    <el-collapse-transition>
      <div v-show="show">
        <el-form :inline="true" :model="form" :label-width="labelWidth" size="small">
          <span v-for="(formItem, itemIndex) in _options" :key="itemIndex" class="form-item-line">
            <el-form-item :label="formItem.title" v-if="formItem.type === 'input'" :class="{'is-required':formItem.required?true:false}">
              <el-input
                v-if="formItem.inputType === 'number'"
                v-model.number="form[formItem.prop]"
                :placeholder="`请输入${formItem.title}`"
                :disabled="disabled || formItem.disabled || false"
                :maxlength="formItem.maxlength || 50"
                @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
              ></el-input>
              <el-input
                v-else
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

            <el-form-item :label="formItem.title" v-if="formItem.type === 'minMax'" class="min-max">
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

            <el-form-item :label="formItem.title" v-if="formItem.type === 'datepicker'">
              <el-date-picker
                v-model="form[formItem.prop]"
                type="date"
                :picker-options="formItem.pickerOptions || null"
                :placeholder="`请选择${formItem.title}`"
                :disabled="disabled || formItem.disabled || false"
                @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="formItem.title" v-if="formItem.type === 'datepicker-range'">
              <el-date-picker
                v-model="form[formItem.prop]"
                type="daterange"
                :picker-options="formItem.pickerOptions || null"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :disabled="disabled || formItem.disabled || false"
                :clearable="formItem.clearable || false"
                @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="formItem.title" v-if="formItem.type === 'datetime'">
              <el-date-picker
                v-model="form[formItem.prop]"
                type="datetime"
                :picker-options="formItem.pickerOptions || null"
                :placeholder="`请选择${formItem.title}`"
                :disabled="disabled || formItem.disabled || false"
                @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="formItem.title" v-if="formItem.type === 'datetime-range'">
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
            <el-form-item :label="formItem.title" v-if="formItem.type === 'year'">
              <el-date-picker
                v-model="form[formItem.prop]"
                type="year"
                :picker-options="formItem.pickerOptions || null"
                :placeholder="`请选择${formItem.title}`"
                :disabled="disabled || formItem.disabled || false"
                @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="formItem.title" v-if="formItem.type === 'month'">
              <el-date-picker
                v-model="form[formItem.prop]"
                type="month"
                :picker-options="formItem.pickerOptions || null"
                :placeholder="`请选择${formItem.title}`"
                :disabled="disabled || formItem.disabled || false"
                @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="formItem.title" v-if="formItem.type === 'cascader'">
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
          </span>
          <el-form-item class="btn-wrap">
            <el-button  type="primary" v-prevent="2000" @click="onSubmit" icon="el-icon-search" :disabled="disabled || false">查询</el-button>
            <el-button  @click="reset" :disabled="disabled || false">重置</el-button>
            <slot name="device-btns"></slot>
            <slot name="extend-btns"></slot>
            <el-button  type="text" @click="onDrop" v-if="options.length > 2" :disabled="disabled || false">
              {{collapse ? '展开' : '收起'}}
              <i
                :class="[collapse ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"
              ></i>
            </el-button>
          </el-form-item>
        </el-form>
        <!--拓展插槽-->
        <slot name="extend-bar"></slot>
        <p class="tips-item" v-if="isResult" :class="{'mr80': showHandler}">
          <i class="el-alert__icon el-icon-info"></i>
          <span>
            共搜索到
            <em>{{total}}</em>条数据
          </span>
        </p>
      </div>
    </el-collapse-transition>
    <p class="handler" :class="{onTop: !show}" v-if="showHandler">
      <el-button
        size="mini"
        id="searchBar-handler"
        @click="show = !show"
        type="text"
        plain
        :icon="!show ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"
      >{{show ? '收起' : '展开'}}</el-button>
    </p>
  </div>
</template>

<script>

export default {
  name: "searchBar",
  props: {
    disabled: {
      default: false
    },
    showHandler: {
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
    },
    // 搜索结果条数
    total: {
      default: 0
    }
  },
  data() {
    return {
      show: true,
      form: {},
      _options: [],
      collapse: true,
      showValidation: false,
      isResult: false,
    };
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
    // 初始化
    console.log(this.options)
    this._options = this.options.slice(0, 2);
    this.options.forEach(item => {
      this.$set(this.form, item.prop, item.value);
    });
  },
  mounted() {

  },
  destroyed() {

  },
  methods: {
    onSubmit() {
      // 验证
      if (this.options.some(option => {
        if (Array.isArray(option.rules) && option.rules.some(rule => {
          if (!new RegExp(rule.pattern).test(this.form[option.prop]) && !rule.loose && this.form[option.prop]) {
            this.$message.error(rule.message || `${option.title}输入有误`)
            return true;
          }
          if (rule.loose === false && !this.form[option.prop]) {
            this.$message.error(`${option.title}不能为空`)
            return true;
          }
        })) {
          return true
        }
      })) {
        return false
      }



      let formData = {};
      for (let key in this.form) {
        if (this.form[key] !== "") formData[key] = this.form[key];
      }

      this.isResult = true;
      this.$emit("search", formData);
    },
    onDrop() {
      this.collapse = !this.collapse;
      if (!this.collapse) {
        this._options = this.options;
      } else {
        this._options = this.options.slice(0, 2);
      }
    },
    reset() {
      // for (let key in this.form) {
      //   this.form[key] = "";
      // }
      this.options.forEach(item => {
        this.$set(this.form, item.prop, item.value);
      });
      this.$emit("reset");
    },
    // 更新
    update(json) {
      if (typeof json != 'object' && Array.isArray(object)) {
        console.log('传入参数必须为JSON')
        return
      }
      for (let key in json) {
        this.form[key] = json[key]
      }
    }
  },

}
</script>

<style lang="less">
.search-bar-comp {
  padding: 15px 10px;
  .handler {
    padding-top: 5px;
    text-align: right;
    font-size: 12px;
    margin-top: -33px;
    color: #999;
    margin-bottom: 10px;
    &.onTop {
      padding-top: 0;
      margin-top: -15px;
      margin-bottom: 0;
    }
    .el-button {
      margin-right: 0;
      padding: 5px 7px;
      height: 18px;
      color: #409eff;
      background: transparent;
      border-color: transparent;
      span {
        margin-left: 0;
      }
    }
  }
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
  .btn-wrap {
    padding-left: 30px;
    margin-bottom: 10px;
  }
  .el-button {
    margin: 0 8px 0 0;
  }
  .tips-item {
    height: 34px;
    line-height: 34px;
    background-color: #f0faff;
    border: 1px solid #abdcff;
    font-size: 12px;
    color: #515a6e;
    border-radius: 4px;
    padding: 0 10px;
    margin: 10px 0 0;
    display: flex;
    align-items: center;
    &.mr80 {
      margin-right: 80px;
    }
    em {
      color: #2d8cf0;
      font-style: normal;
      padding: 0 3px;
    }
    i {
      vertical-align: middle;
      color: #2d8cf0;
      margin-right: 5px;
    }
  }
  .form-item-line {
    display: inline-block;
    vertical-align: top;
    .el-form-item {
      margin-bottom: 10px;
      position: relative;
      .device-btn {
        position: absolute;
        right: 1px;
        top: 2px;
        bottom: 11px;
        border: none;
        box-sizing: border-box;
        margin-right: 0;
        border-left: 1px solid #dcdfe6;
        border-radius: 0 5px 5px 0;
        padding: 0 7px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        min-width: 4em;
      }
    }
  }
  .el-input__inner {
    width: 240px;
  }
  .el-input {
    width: auto;
  }
  .el-form-item__label{
    font-size: 13px;
  }
  .min-max {
    .siding-flag {
      margin: 0 5px;
    }
    input {
      width: 108px;
    }
    .el-input {
      width: 108px;
    }
  }
}
</style>
