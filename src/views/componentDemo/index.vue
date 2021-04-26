<template>
  <!--组件展示demo-->
  <div class="component-container">
    <h1 class="headling">组件展示</h1>
    <section class="comp-item">
      <h4 class="comp-title">搜索框</h4>
      <search-bar
        class="search-bar-demo"
        @search="search"
        :options="searchOptions"
        :total="999"
        labelWidth="80px"
      ></search-bar>
    </section>

    <section class="comp-item">
      <h4 class="comp-title">搜索框-拓展</h4>
      <search-bar
        class="search-bar-demo"
        @search="search"
        :options="searchOptions"
        :total="999"
        labelWidth="80px"
      >
        <control-bar
          slot="extend-bar"
          @select="selectBtn"
          :options="controlOptions"
          position="left"
        ></control-bar>
      </search-bar>
    </section>

    <section class="comp-item">
      <h4 class="comp-title">提示条</h4>
      <tips-line>温馨提示内容</tips-line>
    </section>

    <section class="comp-item">
      <h4 class="comp-title">基本详情</h4>
      <base-info class="mt10" :infoList="infoList"></base-info>
    </section>

    <section class="comp-item">
      <h4 class="comp-title">基本详情面板</h4>
      <info-panel title="游戏详情" class="mt10">
        <base-info :infoList="infoList"></base-info>
      </info-panel>
    </section>

    <section class="comp-item">
      <h4 class="comp-title">折叠面板</h4>
      <fold-panel class="mt10" title="信息详情" :show="true">
        <base-info :infoList="infoList"></base-info>
      </fold-panel>
    </section>

    

    <section class="comp-item">
      <h4 class="comp-title">通用表单</h4>
      <public-form :options="searchOptions"></public-form>
    </section>

    <section class="comp-item">
      <h4 class="comp-title">通用表格</h4>
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
        <template v-slot:switchStatus="data">
          <switch-status
            :scope="data.scopeData"
            idField="id"
            statusField="switchStatus"
            apiName="apiName"
            :status.sync="data.scopeRow.switchStatus"
            :option="{
              enable: {
                label: '启用',
                value: 0,
                message: `是否启用${data.scopeRow.name}`
              },
              disable: {
                label: '冻结',
                value: 1,
                message: `是否禁用${data.scopeRow.name}`
              },
            }"
          >
          </switch-status>
        </template>
        <template v-slot:operation="data">
          <el-button type="text" size="small" @click="view(data.scopeRow.name)">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </public-table>
    </section>

    <section class="comp-item">
      <h4 class="comp-title">选项添加按钮</h4>
      <add-item-btn class="mt10"></add-item-btn>
    </section>

    <section class="comp-item">
      <h4 class="comp-title">页面操作</h4>
      <control-bar :options="controlOptions" position="left" @select="exportExcel"></control-bar>
    </section>

    <section class="comp-item">
      <h4 class="comp-title">分页</h4>
      <table-paging
        position="left"
        :total="999"
        :currentPage="1"
        :pageSize="10"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-paging>
    </section>

    <section class="comp-item">
      <h4 class="comp-title">文件上传</h4>
      <div class="mt10">
        <file-upload
          apiName="uploadFile"
          title="上传应用"
          uploadTip="PNG/JPG文件，单张不超过500K"
          @onSuccess="onSuccess"
          :formData="{
            fileKey: 'file'
          }"
        >
        </file-upload>
      </div>
    </section>

    <section class="comp-item">
      <h4 class="comp-title">多选-文件上传</h4>
      <div class="mt10">
        <file-upload
          apiName="uploadFile"
          title="上传应用"
          uploadTip="PNG/JPG文件，单张不超过500K"
          :multiple="true"
          :limit="5"
          :formData="{
            fileKey: 'file'
          }"
          @onSuccess="onSuccess"
        >
        </file-upload>
      </div>
    </section>

    <section class="comp-item">
      <h4 class="comp-title">拖拽-文件上传</h4>
      <div class="mt10">
        <file-upload
          apiName="uploadFile"
          title="上传应用"
          uploadTip="支持扩展名：.rar .zip .doc .docx .pdf .jpg..."
          :drag="true"
          :multiple="true"
          :limit="5"
          :formData="{
            fileKey: 'file'
          }"
          @onSuccess="onSuccess"
        >
        </file-upload>
      </div>
    </section>

    <section class="comp-item">
      <h4 class="comp-title">照片上传</h4>
      <div class="mt10">
        <picture-upload
          apiName="uploadFile"
          @onSuccess="onSuccess"
          :multiple="true"
          :limit="2"
          :size="2"
          :fileList="fileList"
          :formData="{
            type: 1,
            fileKey: 'file',
            rename: true
          }"
        >
        </picture-upload>
      </div>
    </section>

  </div>
</template>

<script>
import rules from "@/utils/rules.js";

export default {
  name: "componentDemo",
  data() {
    const self = this;
    return {
      params: {},
      fileList: [],
      data1: [
        {
          title: "日期",
          type: "datepicker-range",
          prop: "date4",
          value: "",
          options: ["start", "end"]
        },
        {
          title: "日期5",
          type: "datepicker-range",
          prop: "date5",
          value: "",
          options: ["start5", "end5"]
        },
        {
          title: "日期时间",
          type: "datetime-range",
          prop: "time4",
          value: "",
          options: ["time", "endTime"]
        },
        {
          title: "日期时间5",
          type: "datetime-range",
          prop: "time5",
          value: "",
          options: ["time5", "endTime5"]
        },
        { type: "input", title: "姓名", prop: "name" },
        {
          type: "select",
          title: "性别",
          prop: "sex",
          options: [{ label: "男", value: "0" }, { label: "女", value: "1" }]
        },
        { type: "textarea", title: "备注", prop: "remark" },
        {
          title: "状态",
          type: "select",
          prop: "status",
          value: "",
          options: [{ label: "男", value: "0" }, { label: "女", value: "1" }]
        },
        { title: "兑奖权限", type: "switch", prop: "isShow", value: "" },
        { title: "日期选择", type: "datepicker", prop: "date", value: "" },
        {
          title: "起止日期",
          type: "datepicker-range",
          prop: "",
          value: "",
          options: ["start", "end"]
        },
        {
          title: "起止时间",
          type: "datetime-range",
          prop: "",
          value: "",
          options: ["startTime", "endTime"]
        },
        { title: "兑奖权限", type: "switch", prop: "isShow", value: false },
        {
          title: "性别",
          type: "select",
          prop: "sex",
          value: { label: "女", value: "1" },
          options: [{ label: "男", value: "0" }, { label: "女", value: "1" }]
        },
        {
          title: "单个日期选择",
          type: "datepicker",
          prop: "date1",
          value: "2019-09-12"
        },
        {
          title: "两个日期选择",
          type: "datepicker-range",
          prop: "date2",
          value: ["2019-08-12 09:10:10", "2019-09-20 12:12:12"],
          option: ["start", "end"]
        },
        {
          title: "单个时间",
          type: "datetime",
          prop: "date3",
          value: "2019-03-20 09:10:55"
        },
        {
          title: "两个时间",
          type: "datetime-range",
          prop: "date4",
          value: ["2019-08-12 09:10:10", "2019-09-20 12:12:12"],
          option: ["start", "end"]
        },
        {
          title: "渠道地址",
          type: "address",
          prop: "address",
          value: ["130000", "130200", "130203"],
          address: "天安数码城"
        }
      ],
      data2: [
        {
          title: "单选",
          type: "radio",
          prop: "radio",
          value: "",
          options: [{ key: 1, value: "选项一" }, { key: 2, value: "选项二" }]
        },
        { type: "input", title: "测试", prop: "test" },
        {
          type: "select-multiple",
          title: "下拉（多选）",
          prop: "status",
          options: [{ label: "男", value: "0" }, { label: "女", value: "1" }]
        },
        {
          type: "select",
          title: "状态",
          prop: "status",
          options: [{ label: "男", value: "0" }, { label: "女", value: "1" }]
        },
        {
          title: "试玩渠道",
          type: "radio-textarea",
          prop: "",
          props: ["radio", "radioText"],
          value: ["1", "aa"],
          options: [
            { label: "区域内全部大厅", value: "1" },
            { label: "区域内指定大厅", value: "2" }
          ],
          placeholder: "随便说点啥"
        },
        { type: "textarea", title: "说明", prop: "all" },
        { type: "switch", title: "兑奖权限", prop: "isShow" },
        { type: "datepicker", prop: "date1", value: "", title: "日期选择" },
        {
          type: "datepicker-range",
          prop: "date2",
          value: "",
          title: "日期选择",
          options: ["start", "end"]
        },
        { type: "datetime", prop: "date3", value: "", title: "日期时间" },
        {
          type: "datetime-range",
          prop: "date4",
          value: "",
          title: "日期时间",
          options: ["start", "end"]
        },
        {
          type: "cascader-multiple",
          prop: "cascader1",
          value: "",
          title: "级联选择（多选）",
          options: [
            {
              value: "zhinan",
              label: "指南",
              children: [
                {
                  value: "shejiyuanze",
                  label: "设计原则",
                  children: [
                    {
                      value: "yizhi",
                      label: "一致"
                    },
                    {
                      value: "fankui",
                      label: "反馈"
                    },
                    {
                      value: "xiaolv",
                      label: "效率"
                    },
                    {
                      value: "kekong",
                      label: "可控"
                    }
                  ]
                },
                {
                  value: "daohang",
                  label: "导航",
                  children: [
                    {
                      value: "cexiangdaohang",
                      label: "侧向导航"
                    },
                    {
                      value: "dingbudaohang",
                      label: "顶部导航"
                    }
                  ]
                }
              ]
            },
            {
              value: "zujian",
              label: "组件",
              children: [
                {
                  value: "basic",
                  label: "Basic",
                  children: [
                    {
                      value: "layout",
                      label: "Layout 布局"
                    },
                    {
                      value: "color",
                      label: "Color 色彩"
                    },
                    {
                      value: "typography",
                      label: "Typography 字体"
                    },
                    {
                      value: "icon",
                      label: "Icon 图标"
                    },
                    {
                      value: "button",
                      label: "Button 按钮"
                    }
                  ]
                },
                {
                  value: "form",
                  label: "Form",
                  children: [
                    {
                      value: "radio",
                      label: "Radio 单选框"
                    },
                    {
                      value: "checkbox",
                      label: "Checkbox 多选框"
                    },
                    {
                      value: "input",
                      label: "Input 输入框"
                    },
                    {
                      value: "input-number",
                      label: "InputNumber 计数器"
                    },
                    {
                      value: "select",
                      label: "Select 选择器"
                    },
                    {
                      value: "cascader",
                      label: "Cascader 级联选择器"
                    },
                    {
                      value: "switch",
                      label: "Switch 开关"
                    },
                    {
                      value: "slider",
                      label: "Slider 滑块"
                    },
                    {
                      value: "time-picker",
                      label: "TimePicker 时间选择器"
                    },
                    {
                      value: "date-picker",
                      label: "DatePicker 日期选择器"
                    },
                    {
                      value: "datetime-picker",
                      label: "DateTimePicker 日期时间选择器"
                    },
                    {
                      value: "upload",
                      label: "Upload 上传"
                    },
                    {
                      value: "rate",
                      label: "Rate 评分"
                    },
                    {
                      value: "form",
                      label: "Form 表单"
                    }
                  ]
                },
                {
                  value: "data",
                  label: "Data",
                  children: [
                    {
                      value: "table",
                      label: "Table 表格"
                    },
                    {
                      value: "tag",
                      label: "Tag 标签"
                    },
                    {
                      value: "progress",
                      label: "Progress 进度条"
                    },
                    {
                      value: "tree",
                      label: "Tree 树形控件"
                    },
                    {
                      value: "pagination",
                      label: "Pagination 分页"
                    },
                    {
                      value: "badge",
                      label: "Badge 标记"
                    }
                  ]
                },
                {
                  value: "notice",
                  label: "Notice",
                  children: [
                    {
                      value: "alert",
                      label: "Alert 警告"
                    },
                    {
                      value: "loading",
                      label: "Loading 加载"
                    },
                    {
                      value: "message",
                      label: "Message 消息提示"
                    },
                    {
                      value: "message-box",
                      label: "MessageBox 弹框"
                    },
                    {
                      value: "notification",
                      label: "Notification 通知"
                    }
                  ]
                },
                {
                  value: "navigation",
                  label: "Navigation",
                  children: [
                    {
                      value: "menu",
                      label: "NavMenu 导航菜单"
                    },
                    {
                      value: "tabs",
                      label: "Tabs 标签页"
                    },
                    {
                      value: "breadcrumb",
                      label: "Breadcrumb 面包屑"
                    },
                    {
                      value: "dropdown",
                      label: "Dropdown 下拉菜单"
                    },
                    {
                      value: "steps",
                      label: "Steps 步骤条"
                    }
                  ]
                },
                {
                  value: "others",
                  label: "Others",
                  children: [
                    {
                      value: "dialog",
                      label: "Dialog 对话框"
                    },
                    {
                      value: "tooltip",
                      label: "Tooltip 文字提示"
                    },
                    {
                      value: "popover",
                      label: "Popover 弹出框"
                    },
                    {
                      value: "card",
                      label: "Card 卡片"
                    },
                    {
                      value: "carousel",
                      label: "Carousel 走马灯"
                    },
                    {
                      value: "collapse",
                      label: "Collapse 折叠面板"
                    }
                  ]
                }
              ]
            },
            {
              value: "ziyuan",
              label: "资源",
              children: [
                {
                  value: "axure",
                  label: "Axure Components"
                },
                {
                  value: "sketch",
                  label: "Sketch Templates"
                },
                {
                  value: "jiaohu",
                  label: "组件交互文档"
                }
              ]
            }
          ]
        },
        {
          type: "cascader",
          prop: "cascader1",
          value: "",
          title: "级联选择",
          options: [
            {
              value: "zhinan",
              label: "指南",
              children: [
                {
                  value: "shejiyuanze",
                  label: "设计原则",
                  children: [
                    {
                      value: "yizhi",
                      label: "一致"
                    },
                    {
                      value: "fankui",
                      label: "反馈"
                    },
                    {
                      value: "xiaolv",
                      label: "效率"
                    },
                    {
                      value: "kekong",
                      label: "可控"
                    }
                  ]
                },
                {
                  value: "daohang",
                  label: "导航",
                  children: [
                    {
                      value: "cexiangdaohang",
                      label: "侧向导航"
                    },
                    {
                      value: "dingbudaohang",
                      label: "顶部导航"
                    }
                  ]
                }
              ]
            },
            {
              value: "zujian",
              label: "组件",
              children: [
                {
                  value: "basic",
                  label: "Basic",
                  children: [
                    {
                      value: "layout",
                      label: "Layout 布局"
                    },
                    {
                      value: "color",
                      label: "Color 色彩"
                    },
                    {
                      value: "typography",
                      label: "Typography 字体"
                    },
                    {
                      value: "icon",
                      label: "Icon 图标"
                    },
                    {
                      value: "button",
                      label: "Button 按钮"
                    }
                  ]
                },
                {
                  value: "form",
                  label: "Form",
                  children: [
                    {
                      value: "radio",
                      label: "Radio 单选框"
                    },
                    {
                      value: "checkbox",
                      label: "Checkbox 多选框"
                    },
                    {
                      value: "input",
                      label: "Input 输入框"
                    },
                    {
                      value: "input-number",
                      label: "InputNumber 计数器"
                    },
                    {
                      value: "select",
                      label: "Select 选择器"
                    },
                    {
                      value: "cascader",
                      label: "Cascader 级联选择器"
                    },
                    {
                      value: "switch",
                      label: "Switch 开关"
                    },
                    {
                      value: "slider",
                      label: "Slider 滑块"
                    },
                    {
                      value: "time-picker",
                      label: "TimePicker 时间选择器"
                    },
                    {
                      value: "date-picker",
                      label: "DatePicker 日期选择器"
                    },
                    {
                      value: "datetime-picker",
                      label: "DateTimePicker 日期时间选择器"
                    },
                    {
                      value: "upload",
                      label: "Upload 上传"
                    },
                    {
                      value: "rate",
                      label: "Rate 评分"
                    },
                    {
                      value: "form",
                      label: "Form 表单"
                    }
                  ]
                },
                {
                  value: "data",
                  label: "Data",
                  children: [
                    {
                      value: "table",
                      label: "Table 表格"
                    },
                    {
                      value: "tag",
                      label: "Tag 标签"
                    },
                    {
                      value: "progress",
                      label: "Progress 进度条"
                    },
                    {
                      value: "tree",
                      label: "Tree 树形控件"
                    },
                    {
                      value: "pagination",
                      label: "Pagination 分页"
                    },
                    {
                      value: "badge",
                      label: "Badge 标记"
                    }
                  ]
                },
                {
                  value: "notice",
                  label: "Notice",
                  children: [
                    {
                      value: "alert",
                      label: "Alert 警告"
                    },
                    {
                      value: "loading",
                      label: "Loading 加载"
                    },
                    {
                      value: "message",
                      label: "Message 消息提示"
                    },
                    {
                      value: "message-box",
                      label: "MessageBox 弹框"
                    },
                    {
                      value: "notification",
                      label: "Notification 通知"
                    }
                  ]
                },
                {
                  value: "navigation",
                  label: "Navigation",
                  children: [
                    {
                      value: "menu",
                      label: "NavMenu 导航菜单"
                    },
                    {
                      value: "tabs",
                      label: "Tabs 标签页"
                    },
                    {
                      value: "breadcrumb",
                      label: "Breadcrumb 面包屑"
                    },
                    {
                      value: "dropdown",
                      label: "Dropdown 下拉菜单"
                    },
                    {
                      value: "steps",
                      label: "Steps 步骤条"
                    }
                  ]
                },
                {
                  value: "others",
                  label: "Others",
                  children: [
                    {
                      value: "dialog",
                      label: "Dialog 对话框"
                    },
                    {
                      value: "tooltip",
                      label: "Tooltip 文字提示"
                    },
                    {
                      value: "popover",
                      label: "Popover 弹出框"
                    },
                    {
                      value: "card",
                      label: "Card 卡片"
                    },
                    {
                      value: "carousel",
                      label: "Carousel 走马灯"
                    },
                    {
                      value: "collapse",
                      label: "Collapse 折叠面板"
                    }
                  ]
                }
              ]
            },
            {
              value: "ziyuan",
              label: "资源",
              children: [
                {
                  value: "axure",
                  label: "Axure Components"
                },
                {
                  value: "sketch",
                  label: "Sketch Templates"
                },
                {
                  value: "jiaohu",
                  label: "组件交互文档"
                }
              ]
            }
          ]
        }
      ],
      rules1: {
        name: [
          { required: true, validator: rules.checkEmail, trigger: ['change','blur'] }
        ],
        sex: [{ required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }],
        remark: [
          { required: true, validator: rules.checkEmail, trigger: ['change','blur'] }
        ]
      },
      rules2: {
        test: [
          { required: true, validator: rules.checkEmail, trigger: ['change','blur'] }
        ],
        status: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
        all: [{ required: true, validator: rules.checkEmail, trigger: ['change','blur'] }]
      },
      // 搜索组件配置
      searchOptions: [
        { 
          title: "姓名", type: "input", prop: "inputName", value: "",
          rules: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        },
        {
          title: "设备状态",
          type: "select",
          prop: "selectName",
          value: "",
          options: [
            {
              label: "选项1",
              value: 1
            },
            {
              label: "选项2",
              value: 2
            }
          ]
        },
        { title: "开售日期", type: "datepicker", prop: "date1", value: "" },
        {
          title: "销售日期",
          type: "datepicker-range",
          prop: "date2",
          value: ""
        },
        { title: "开售时间", type: "datetime", prop: "date3", value: "" },
        { title: "销售时间", type: "datetime-range", prop: "date4", value: "" },
        {
          type: "cascader",
          prop: "cascader1",
          value: "",
          title: "所属机构",
          options: [
            {
              value: "zhinan",
              label: "指南",
              children: [
                {
                  value: "shejiyuanze",
                  label: "设计原则",
                  children: [
                    {
                      value: "yizhi",
                      label: "一致"
                    },
                    {
                      value: "fankui",
                      label: "反馈"
                    },
                    {
                      value: "xiaolv",
                      label: "效率"
                    },
                    {
                      value: "kekong",
                      label: "可控"
                    }
                  ]
                },
                {
                  value: "daohang",
                  label: "导航",
                  children: [
                    {
                      value: "cexiangdaohang",
                      label: "侧向导航"
                    },
                    {
                      value: "dingbudaohang",
                      label: "顶部导航"
                    }
                  ]
                }
              ]
            },
            {
              value: "zujian",
              label: "组件",
              children: [
                {
                  value: "basic",
                  label: "Basic",
                  children: [
                    {
                      value: "layout",
                      label: "Layout 布局"
                    },
                    {
                      value: "color",
                      label: "Color 色彩"
                    },
                    {
                      value: "typography",
                      label: "Typography 字体"
                    },
                    {
                      value: "icon",
                      label: "Icon 图标"
                    },
                    {
                      value: "button",
                      label: "Button 按钮"
                    }
                  ]
                },
                {
                  value: "form",
                  label: "Form",
                  children: [
                    {
                      value: "radio",
                      label: "Radio 单选框"
                    },
                    {
                      value: "checkbox",
                      label: "Checkbox 多选框"
                    },
                    {
                      value: "input",
                      label: "Input 输入框"
                    },
                    {
                      value: "input-number",
                      label: "InputNumber 计数器"
                    },
                    {
                      value: "select",
                      label: "Select 选择器"
                    },
                    {
                      value: "cascader",
                      label: "Cascader 级联选择器"
                    },
                    {
                      value: "switch",
                      label: "Switch 开关"
                    },
                    {
                      value: "slider",
                      label: "Slider 滑块"
                    },
                    {
                      value: "time-picker",
                      label: "TimePicker 时间选择器"
                    },
                    {
                      value: "date-picker",
                      label: "DatePicker 日期选择器"
                    },
                    {
                      value: "datetime-picker",
                      label: "DateTimePicker 日期时间选择器"
                    },
                    {
                      value: "upload",
                      label: "Upload 上传"
                    },
                    {
                      value: "rate",
                      label: "Rate 评分"
                    },
                    {
                      value: "form",
                      label: "Form 表单"
                    }
                  ]
                },
                {
                  value: "data",
                  label: "Data",
                  children: [
                    {
                      value: "table",
                      label: "Table 表格"
                    },
                    {
                      value: "tag",
                      label: "Tag 标签"
                    },
                    {
                      value: "progress",
                      label: "Progress 进度条"
                    },
                    {
                      value: "tree",
                      label: "Tree 树形控件"
                    },
                    {
                      value: "pagination",
                      label: "Pagination 分页"
                    },
                    {
                      value: "badge",
                      label: "Badge 标记"
                    }
                  ]
                },
                {
                  value: "notice",
                  label: "Notice",
                  children: [
                    {
                      value: "alert",
                      label: "Alert 警告"
                    },
                    {
                      value: "loading",
                      label: "Loading 加载"
                    },
                    {
                      value: "message",
                      label: "Message 消息提示"
                    },
                    {
                      value: "message-box",
                      label: "MessageBox 弹框"
                    },
                    {
                      value: "notification",
                      label: "Notification 通知"
                    }
                  ]
                },
                {
                  value: "navigation",
                  label: "Navigation",
                  children: [
                    {
                      value: "menu",
                      label: "NavMenu 导航菜单"
                    },
                    {
                      value: "tabs",
                      label: "Tabs 标签页"
                    },
                    {
                      value: "breadcrumb",
                      label: "Breadcrumb 面包屑"
                    },
                    {
                      value: "dropdown",
                      label: "Dropdown 下拉菜单"
                    },
                    {
                      value: "steps",
                      label: "Steps 步骤条"
                    }
                  ]
                },
                {
                  value: "others",
                  label: "Others",
                  children: [
                    {
                      value: "dialog",
                      label: "Dialog 对话框"
                    },
                    {
                      value: "tooltip",
                      label: "Tooltip 文字提示"
                    },
                    {
                      value: "popover",
                      label: "Popover 弹出框"
                    },
                    {
                      value: "card",
                      label: "Card 卡片"
                    },
                    {
                      value: "carousel",
                      label: "Carousel 走马灯"
                    },
                    {
                      value: "collapse",
                      label: "Collapse 折叠面板"
                    }
                  ]
                }
              ]
            },
            {
              value: "ziyuan",
              label: "资源",
              children: [
                {
                  value: "axure",
                  label: "Axure Components"
                },
                {
                  value: "sketch",
                  label: "Sketch Templates"
                },
                {
                  value: "jiaohu",
                  label: "组件交互文档"
                }
              ]
            }
          ]
        },
        {
          type: "datetime",
          prop: "date3",
          value: "",
          title: "日期时间"
        },
        {
          type: "datetime-range",
          prop: "date4",
          value: "",
          title: "日期时间"
        },
        {
          type: "cascader",
          prop: "cascader1",
          value: "",
          title: "级联选择",
          options: [
            {
              value: "zhinan",
              label: "指南",
              children: [
                {
                  value: "shejiyuanze",
                  label: "设计原则",
                  children: [
                    {
                      value: "yizhi",
                      label: "一致"
                    },
                    {
                      value: "fankui",
                      label: "反馈"
                    },
                    {
                      value: "xiaolv",
                      label: "效率"
                    },
                    {
                      value: "kekong",
                      label: "可控"
                    }
                  ]
                },
                {
                  value: "daohang",
                  label: "导航",
                  children: [
                    {
                      value: "cexiangdaohang",
                      label: "侧向导航"
                    },
                    {
                      value: "dingbudaohang",
                      label: "顶部导航"
                    }
                  ]
                }
              ]
            },
            {
              value: "zujian",
              label: "组件",
              children: [
                {
                  value: "basic",
                  label: "Basic",
                  children: [
                    {
                      value: "layout",
                      label: "Layout 布局"
                    },
                    {
                      value: "color",
                      label: "Color 色彩"
                    },
                    {
                      value: "typography",
                      label: "Typography 字体"
                    },
                    {
                      value: "icon",
                      label: "Icon 图标"
                    },
                    {
                      value: "button",
                      label: "Button 按钮"
                    }
                  ]
                },
                {
                  value: "form",
                  label: "Form",
                  children: [
                    {
                      value: "radio",
                      label: "Radio 单选框"
                    },
                    {
                      value: "checkbox",
                      label: "Checkbox 多选框"
                    },
                    {
                      value: "input",
                      label: "Input 输入框"
                    },
                    {
                      value: "input-number",
                      label: "InputNumber 计数器"
                    },
                    {
                      value: "select",
                      label: "Select 选择器"
                    },
                    {
                      value: "cascader",
                      label: "Cascader 级联选择器"
                    },
                    {
                      value: "switch",
                      label: "Switch 开关"
                    },
                    {
                      value: "slider",
                      label: "Slider 滑块"
                    },
                    {
                      value: "time-picker",
                      label: "TimePicker 时间选择器"
                    },
                    {
                      value: "date-picker",
                      label: "DatePicker 日期选择器"
                    },
                    {
                      value: "datetime-picker",
                      label: "DateTimePicker 日期时间选择器"
                    },
                    {
                      value: "upload",
                      label: "Upload 上传"
                    },
                    {
                      value: "rate",
                      label: "Rate 评分"
                    },
                    {
                      value: "form",
                      label: "Form 表单"
                    }
                  ]
                },
                {
                  value: "data",
                  label: "Data",
                  children: [
                    {
                      value: "table",
                      label: "Table 表格"
                    },
                    {
                      value: "tag",
                      label: "Tag 标签"
                    },
                    {
                      value: "progress",
                      label: "Progress 进度条"
                    },
                    {
                      value: "tree",
                      label: "Tree 树形控件"
                    },
                    {
                      value: "pagination",
                      label: "Pagination 分页"
                    },
                    {
                      value: "badge",
                      label: "Badge 标记"
                    }
                  ]
                },
                {
                  value: "notice",
                  label: "Notice",
                  children: [
                    {
                      value: "alert",
                      label: "Alert 警告"
                    },
                    {
                      value: "loading",
                      label: "Loading 加载"
                    },
                    {
                      value: "message",
                      label: "Message 消息提示"
                    },
                    {
                      value: "message-box",
                      label: "MessageBox 弹框"
                    },
                    {
                      value: "notification",
                      label: "Notification 通知"
                    }
                  ]
                },
                {
                  value: "navigation",
                  label: "Navigation",
                  children: [
                    {
                      value: "menu",
                      label: "NavMenu 导航菜单"
                    },
                    {
                      value: "tabs",
                      label: "Tabs 标签页"
                    },
                    {
                      value: "breadcrumb",
                      label: "Breadcrumb 面包屑"
                    },
                    {
                      value: "dropdown",
                      label: "Dropdown 下拉菜单"
                    },
                    {
                      value: "steps",
                      label: "Steps 步骤条"
                    }
                  ]
                },
                {
                  value: "others",
                  label: "Others",
                  children: [
                    {
                      value: "dialog",
                      label: "Dialog 对话框"
                    },
                    {
                      value: "tooltip",
                      label: "Tooltip 文字提示"
                    },
                    {
                      value: "popover",
                      label: "Popover 弹出框"
                    },
                    {
                      value: "card",
                      label: "Card 卡片"
                    },
                    {
                      value: "carousel",
                      label: "Carousel 走马灯"
                    },
                    {
                      value: "collapse",
                      label: "Collapse 折叠面板"
                    }
                  ]
                }
              ]
            },
            {
              value: "ziyuan",
              label: "资源",
              children: [
                {
                  value: "axure",
                  label: "Axure Components"
                },
                {
                  value: "sketch",
                  label: "Sketch Templates"
                },
                {
                  value: "jiaohu",
                  label: "组件交互文档"
                }
              ]
            }
          ]
        }
      ],
      infoList: [
        { title: "游戏编码", content: "12345678", prop: "gameCode" },
        { title: "周期类型", content: "按月", prop: "cycleType" },
        { title: "游戏状态", content: "生效", prop: "gameStatus" },
        { title: "游戏名称", content: "贪玩蓝月", prop: "gameName" },
        { title: "游戏编码", content: "12345678", prop: "gameCode" },
        { title: "周期类型", content: "按月", prop: "cycleType" },
        { title: "游戏状态", content: "生效", prop: "gameStatus" },
        { title: "游戏名称", content: "贪玩蓝月", prop: "gameName" },
        { title: "游戏编码", content: "12345678", prop: "gameCode" },
        { title: "周期类型", content: "按月", prop: "cycleType" },
        { title: "游戏状态", content: "生效", prop: "gameStatus" },
        { title: "游戏名称", content: "贪玩蓝月", prop: "gameName" },
        { title: "游戏类型", content: "益智类", prop: "officialEndSale" }
      ],
      form: {
        singleAmount: "",
        minMultiple: "",
        mixBet: "",
        bet: "",
        logOff: "",
        textarea: ""
      },
      controlOptions: [
        { name: "新建计划", type: "primary", iconClass: "el-icon-plus" }, // type为按钮的五种颜色， iconClass为具体的图标类名
        { name: "批量删除", type: "", iconClass: "el-icon-delete" },
        { name: "刷新", type: "", iconClass: "el-icon-refresh-right" },
        { name: "打印", type: "primary", iconClass: "el-icon-printer" },
        { name: "导出", type: "danger", iconClass: "el-icon-download" },
        { name: "导出", type: "success", iconClass: "el-icon-upload" },
        { name: "导出", type: "warning", iconClass: "el-icon-download" }
      ],
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
        },
        {
          label: 'switch状态',
          hasScope: true,
          slotName: 'switchStatus',
          minWidth: 150
        }
      ],
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          switchStatus: 0
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          switchStatus: 0
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          switchStatus: 1
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          switchStatus: 0
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          switchStatus: 1
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          switchStatus: 1
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          switchStatus: 0
        }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    submit() {},
    cancel() {},
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    changeForm(val) {
      Object.assign(this.params, val);
      console.log("派发出来的参数", this.params);
    },
    changeSelect(val) {
      console.log(this.form, val);
    },
    selectBtn(val) {
      console.log(val);
    },
    search(form) {
      console.log("search", form);
    },
    handleSizeChange(pageSize) {
      console.log(pageSize);
    },
    handleCurrentChange(currentPage) {
      console.log(currentPage);
    },

    // 文件上传成功
    onSuccess(data) {
      console.log('data', data)
    },

    async exportExcel() {
      const res = await this.$api.outExport({
        data: {
          page: 1,
          pageSize: 10,
          all: false,
          status: 1,
          documentNumber: "",
          documentToppic: ""
        },
        responseType: "blob"
      });
      this.downloadExcel(res.blob, 'excel')
    },
    view(name) {
      console.log('查看' + name)
    }
  },
  components: {}
};
</script>


<style lang="less" scoped>
// 组件展示demo样式
.component-container{
  padding: 15px;
  .mt10{
    margin-top: 10px;
  }
  .headling{
    padding: 15px;
  }
  .comp-item{
    background-color: #fff;
    padding: 10px;
    margin-bottom: 10px;
  }
  .comp-title{
    padding: 10px;
    border-bottom: 1px solid #eae9e9;
    font-size: 16px;
  }

  .search-bar-demo{
    padding: 20px 10px 0;
    .extend-item{
      display: inline-block;
      vertical-align: top;
    }
  }
}
</style>
