<template>
  <div class="right-board">
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane label="组件属性" name="field" />
      <el-tab-pane label="表单属性" name="form" />
    </el-tabs>
    <div class="field-box">
      <a class="document-link" target="_blank" :href="documentLink" title="查看组件文档">
        <i class="el-icon-link"></i>
      </a>
      <el-scrollbar class="right-scrollbar">
<!--     组件属性   -->
        <el-form v-show="currentTab === 'field' && showField" size="small" label-width="90px">
          <el-form-item v-if="activeData.__vModel__ !== undefined" label="字段名">
            <el-input v-model="activeData.__vModel__" placeholder="请输入字段名" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.label!==undefined" label="标题">
            <el-input v-model="activeData.__config__.label" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item v-if="activeData.placeholder!==undefined" label="占位提示">
            <el-input v-model="activeData.placeholder" placeholder="请输入占位提示" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.span!==undefined" label="表单栅格">
            <el-slider v-model="activeData.__config__.span" :max="24" :min="1" :marks="{12:''}" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.labelWidth!==undefined" label="标签宽度">
            <el-input v-model.number="activeData.__config__.labelWidth" type="number" placeholder="请输入标签宽度" />
          </el-form-item>
          <el-form-item v-if="activeData.style&&activeData.style.width!==undefined" label="组件宽度">
            <el-input v-model="activeData.style.width" placeholder="请输入组件宽度" clearable />
          </el-form-item>
          <el-form-item v-if="activeData.__vModel__!==undefined" label="默认值">
            <el-input
                :value="setDefaultValue(activeData.__config__.defaultValue)"
                placeholder="请输入默认值"
                @input="onDefaultValueInput"
            />
          </el-form-item>
          <el-form-item v-if="activeData.__slot__&&activeData.__slot__.prepend!==undefined" label="前缀">
            <el-input v-model="activeData.__slot__.prepend" placeholder="请输入前缀" />
          </el-form-item>
          <el-form-item v-if="activeData.__slot__&&activeData.__slot__.append!==undefined" label="后缀">
            <el-input v-model="activeData.__slot__.append" placeholder="请输入后缀" />
          </el-form-item>
          <el-form-item v-if="activeData['prefix-icon']!==undefined" label="前图标">
            <el-input v-model="activeData['prefix-icon']" placeholder="请输入前图标名称">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('prefix-icon')">
                选择
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData['suffix-icon'] !== undefined" label="后图标">
            <el-input v-model="activeData['suffix-icon']" placeholder="请输入后图标名称">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('suffix-icon')">
                选择
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData.maxlength !== undefined" label="最多输入">
            <el-input v-model="activeData.maxlength" placeholder="请输入字符长度">
              <template slot="append">
                个字符
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData.__config__.showLabel !== undefined
            && activeData.__config__.labelWidth !== undefined" label="显示标签"
          >
            <el-switch v-model="activeData.__config__.showLabel" />
          </el-form-item>
          <el-form-item v-if="activeData['show-word-limit'] !== undefined" label="输入统计">
            <el-switch v-model="activeData['show-word-limit']" />
          </el-form-item>
          <el-form-item v-if="activeData.clearable !== undefined" label="能否清空">
            <el-switch v-model="activeData.clearable" />
          </el-form-item>
          <el-form-item v-if="activeData.readonly !== undefined" label="是否只读">
            <el-switch v-model="activeData.readonly" />
          </el-form-item>
          <el-form-item v-if="activeData.disabled !== undefined" label="是否禁用">
            <el-switch v-model="activeData.disabled" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.required !== undefined" label="是否必填">
            <el-switch v-model="activeData.__config__.required" />
          </el-form-item>
          <template v-if="['el-select'].includes(activeData.__config__.tag)">
            <el-divider>选项</el-divider>
            <draggable
              :list="activeData.__slot__.options"
              :animation="300"
              group="selectItem"
              handle=".option-drag"
            >
              <div v-for="(item, index) in activeData.__slot__.options" :key="index" class="select-item">
                <div class="select-line-icon option-drag">
                  <i class="el-icon-s-operation" />
                </div>
                <el-input v-model="item.label" placeholder="选项名" size="small" />
                <el-input :value="item.value" size="small" @input="setOptionValue(item, $event)" placeholder="选项值" />
                <div class="close-btn select-line-icon" @click="activeData.__slot__.options.splice(index, 1)">
                  <i class="el-icon-remove-outline" />
                </div>
              </div>
            </draggable>
            <div style="margin-left: 20px;">
              <el-button
                  style="padding-bottom: 0"
                  icon="el-icon-circle-plus-outline"
                  type="text"
                  @click="addSelectItem">
                添加选项
              </el-button>
            </div>
            <el-divider />
          </template>
          <template v-if="Array.isArray(activeData.__config__.regList)">
            <el-divider>正则校验</el-divider>
            <div
                v-for="(item, index) in activeData.__config__.regList"
                :key="index"
                class="reg-item"
            >
              <span class="close-btn" @click="activeData.__config__.regList.splice(index, 1)">
                <i class="el-icon-close" />
              </span>
              <el-form-item label="表达式">
                <el-input v-model="item.pattern" placeholder="请输入正则" />
              </el-form-item>
              <el-form-item label="错误提示" style="margin-bottom:0">
                <el-input v-model="item.message" placeholder="请输入错误提示" />
              </el-form-item>
            </div>
            <div style="margin-left: 20px">
              <el-button icon="el-icon-circle-plus-outline" type="text" @click="addReg">
                添加规则
              </el-button>
            </div>
          </template>
        </el-form>
        <!--     表单属性   -->
        <el-form v-show="currentTab === 'form'" size="small" label-width="90px">
          <el-form-item label="表单名">
            <el-input v-model="formConf.formRef" placeholder="请输入表单名（ref）" />
          </el-form-item>
          <el-form-item label="表单模型">
            <el-input v-model="formConf.formModel" placeholder="请输入数据模型" />
          </el-form-item>
          <el-form-item label="校验模型">
            <el-input v-model="formConf.formRules" placeholder="请输入校验模型" />
          </el-form-item>
          <el-form-item label="表单尺寸">
            <el-radio-group v-model="formConf.size">
              <el-radio-button label="medium">
                中等
              </el-radio-button>
              <el-radio-button label="small">
                较小
              </el-radio-button>
              <el-radio-button label="mini">
                迷你
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标签对齐">
            <el-radio-group v-model="formConf.labelPosition">
              <el-radio-button label="left">
                左对齐
              </el-radio-button>
              <el-radio-button label="right">
                右对齐
              </el-radio-button>
              <el-radio-button label="top">
                顶部对齐
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标签宽度">
            <el-input v-model.number="formConf.labelWidth" type="number" placeholder="请输入标签宽度" />
          </el-form-item>
          <el-form-item label="栅格间隔">
            <el-input-number v-model="formConf.gutter" :min="0" placeholder="栅格间隔" />
          </el-form-item>
          <el-form-item label="禁用表单">
            <el-switch v-model="formConf.disabled" />
          </el-form-item>
          <el-form-item label="表单按钮">
            <el-switch v-model="formConf.formBtns" />
          </el-form-item>
          <el-form-item label="显示未选中组件边框">
            <el-switch v-model="formConf.unFocusedComponentBorder" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>
    <icons-dialog :visible.sync="iconsVisible" :current="activeData[currentIconModel]" @select="setIcon" />
  </div>
</template>

<script>

// 使changeRenderKey在目标组件改变时可用
import {isNumberStr} from '@/utils/index'
import IconsDialog from "@/views/index/IconsDialog.vue";
import draggable from "vuedraggable";
export default {
  components: {
    IconsDialog,
    draggable
  },
  props: ['showField', 'activeData', 'formConf'],
  data() {
    return {
      currentTab: 'field',
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      currentIconModel: null
    }
  },
  computed: {
    documentLink() {
      return this.activeData.__config__.document || 'https://element.eleme.cn/#/zh-CN/component/installation'
    }
  },
  methods: {
    openIconsDialog(model) {
      this.iconsVisible = true
      this.currentIconModel = model
    },
    setIcon(icon) {
      this.activeData[this.currentIconModel] = icon
    },
    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(',')
      }
      if (typeof val === 'boolean') {
        return `${val}`
      }
      return val
    },
    onDefaultValueInput (str) {
      if (Array.isArray(this.activeData.__config__.defaultValue)) {
        // this.activeData.__config__.defaultValue = str.split(',')
      } else if (['true', 'false'].includes(str)) {
        this.$set(this.activeData.__config__, 'defaultValue', str === 'true')
      } else {
        // 字符串和数字
        this.$set(this.activeData.__config__, 'defaultValue', isNumberStr(str) ? +str : str)
      }
    },
    addReg() {
      this.activeData.__config__.regList.push({
        pattern: '',
        message: ''
      })
    },
    setOptionValue (item, val) {
      item.value = isNumberStr(val) ? +val : val
    },
    addSelectItem() {
      this.activeData.__slot__.options.push({
        label: '',
        value: ''
      })
    },
    changeRenderKey() {
      // if (needRerenderList.includes(this.activeData.__config__.tag)) {
      //   this.activeData.__config__.renderKey = +new Date()
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.right-board {
  width: 350px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;
  .field-box {
    position: relative;
    height: calc(100vh - 42px);
    box-sizing: border-box;
    overflow: hidden;
  }
  .el-scrollbar {
    height: 100%;
  }
}
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .el-input + .el-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
.option-drag {
  cursor: move;
}
.time-range {
  .el-date-editor {
    width: 227px;
  }
  ::v-deep .el-icon-time {
    display: none;
  }
}
.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}
.node-label{
  font-size: 14px;
}
.node-icon{
  color: #bebfc3;
}
</style>
