<template>
  <div class="container">
    <div class="left-board">
      <el-scrollbar class="left-scrollbar">
        <div class="components-list">
          <div v-for="(item, index) in leftComponents" :key="index">
            <div class="components-title">{{ item.title }}</div>
            <draggable
                class="components-draggable"
                :list="item.list"
                :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                :clone="cloneComponent"
                draggable=".components-item"
                :sort="false"
                @end="endHandler"
            >
              <div v-for="(component, index) in item.list" :key="index" class="components-item" @click="addComponent(component)">
                <div class="components-body">{{ component.__config__.label }}</div>
              </div>
            </draggable>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="center-board">
      <div class="action-bar">
        <el-button icon="el-icon-video-play" type="text" @click="run">
          运行
        </el-button>
        <el-button icon="el-icon-view" type="text" @click="showJson">
          查看json
        </el-button>
        <el-button icon="el-icon-download" type="text" @click="download">
          导出vue文件
        </el-button>
        <el-button class="copy-btn-main" icon="el-icon-document-copy" type="text" @click="copy">
          复制代码
        </el-button>
        <el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty">
          清空
        </el-button>
      </div>
      <el-scrollbar class="center-scrollbar">
        <el-row class="center-board-row" :gutter="formConf.gutter">
          <el-form
            :size="formConf.size"
            :label-position="formConf.labelPosition"
            :label-width="formConf.labelWidth + 'px'"
            :disabled="formConf.disabled"
          >
            <draggable class="drawing-board" :list="drawingList" :animation="300" group="componentsGroup">
              <DraggableItem
                v-for="(item, index) in drawingList"
                :key="item.renderKey"
                :currentItem="item"
                :index="index"
                :drawingList="drawingList"
                :activeId="activeId"
                :formConf="formConf"
                @activeItem="setActiveFormItem"
                @copyItem="drawingItemCopy"
                @deleteItem="drawingItemDelete"
              ></DraggableItem>
            </draggable>
            <div class="empty-info" v-show="drawingList.length === 0">
              从左侧拖入或点选组件进行表单设计
            </div>
          </el-form>
        </el-row>
      </el-scrollbar>
    </div>

    <RightPanel
      :activeData="activeData"
      :formConf="formConf"
      :show-field="!!drawingList.length"
      @tagChange="tagChange"
    ></RightPanel>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import RightPanel from "@/views/index/RightPanel.vue";
import {formConf, inputComponents, selectComponents} from "@/components/generator/config";
import drawingDefalut from "@/components/generator/drawingDefalut";
import DraggableItem from "@/views/index/DraggableItem.vue";
import {getIdGlobal} from "@/utils/db";
import {cloneDeep} from "lodash";

const idGlobal = getIdGlobal()
let tempActiveData
export default {
  name: 'Home',
  computed: {
  },
  components: {
    RightPanel,
    draggable,
    DraggableItem
  },
  data() {
    return {
      idGlobal,
      formConf,
      formData: {},
      activeData: drawingDefalut[0],
      activeId: drawingDefalut[0].formId,
      drawingList: drawingDefalut,
      jsonDrawerVisible: false,
      leftComponents: [
        {
          title: '输入型组件',
          list: inputComponents
        },
        {
          title: '选择型组件',
          list: selectComponents
        }
      ],
    }
  },
  mounted() {
    this.drawingList = drawingDefalut
    this.setActiveFormItem(this.drawingList[0])
  },
  methods: {
    tagChange() {

    },
    cloneComponent (origin) {
      const clone = cloneDeep(origin)
      const config = clone.__config__
      // 设置span默认值
      config.span = this.formConf.span
      this.createIdAndKey(clone)
      clone.placeholder !== undefined && (clone.placeholder += config.label)
      tempActiveData = clone
      return tempActiveData
    },
    endHandler (event) {
      console.log('end')
      if (event.from !== event.to) {
        this.activeData = tempActiveData
        this.activeId = this.activeData.__config__.formId
        // this.activeId = this.idGlobal
      }
    },
    addComponent (item) {
      const clone = this.cloneComponent(item)
      this.drawingList.push(clone)
      this.setActiveFormItem(clone)
    },
    setActiveFormItem (item) {
      this.activeData = item
      this.activeId = item.__config__.formId
    },
    /**
     * 创建id和key,以及设置__vModel__
     * @param item
     * @returns {*}
     */
    createIdAndKey (item) {
      const config = item.__config__
      config.formId = ++this.idGlobal
      config.renderKey = `${config.formId}${+new Date()}` // 用于唯一标识每个组件
      if(config.layout === 'colFormItem') {
        item.__vModel__ = `field${config.formId}`
      }
      return item
    },
    drawingItemCopy (current, list) {
      let clone = cloneDeep(current)
      this.createIdAndKey(clone)
      list.push(clone)
      this.setActiveFormItem(clone)
    },
    drawingItemDelete (index, list) {
      list.splice(index, 1)
      if (list.length === 0) {
        this.activeData = {}
        this.activeId = ''
      } else {
        this.setActiveFormItem(list[list.length - 1])
      }
    },
    mergeJson() {
      this.formData = {
        fields: cloneDeep(this.drawingList),
        ...this.formConf
      }
    },
    run () {},
    showJson () {
      this.mergeJson()
      this.jsonDrawerVisible = true
    },
    download () {},
    copy () {},
    empty () {},
  }
}
</script>

<style lang="scss">
@import '@/styles/home.scss';
</style>
