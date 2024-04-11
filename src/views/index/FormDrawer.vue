<template>
<div>
  <el-drawer v-bind="$attrs" v-on="$listeners" @opened="onOpen" @close="onClose">
    <div style="height:100%">
      <el-row style="height:100%;overflow:auto">
        <el-col :md="24" :lg="12" class="left-editor">
          <el-tabs v-model="activeTab" type="card" class="editor-tabs">
            <el-tab-pane name="html">
                <span slot="label">
                  <i v-if="activeTab==='html'" class="el-icon-edit" />
                  <i v-else class="el-icon-document" />
                  template
                </span>
            </el-tab-pane>
            <el-tab-pane name="js">
                <span slot="label">
                  <i v-if="activeTab==='js'" class="el-icon-edit" />
                  <i v-else class="el-icon-document" />
                  script
                </span>
            </el-tab-pane>
            <el-tab-pane name="css">
                <span slot="label">
                  <i v-if="activeTab==='css'" class="el-icon-edit" />
                  <i v-else class="el-icon-document" />
                  css
                </span>
            </el-tab-pane>
          </el-tabs>
          <div v-show="activeTab==='html'" id="editorHtml" class="tab-editor" />
          <div v-show="activeTab==='js'" id="editorJs" class="tab-editor" />
          <div v-show="activeTab==='css'" id="editorCss" class="tab-editor" />
        </el-col>
        <el-col :md="24" :lg="12" class="right-preview">
          <iframe
              v-show="isIframeLoaded"
              ref="previewPage"
              class="result-wrapper"
              frameborder="0"
              src="preview.html"
              @load="iframeLoad"
          />
          <div v-show="!isIframeLoaded" v-loading="true" class="result-wrapper" />
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</div>
</template>

<script>
import { parse } from '@babel/parser';
import {cookHtml} from "@/components/generator/html";
import {cookJs} from "@/components/generator/js";
import {cookCss} from "@/components/generator/css";
import loadBeautifier from "@/utils/loadBeautifer";
import {beautifierConf, exportDefault} from "@/utils";
import loadMonaco from "@/utils/loadMonaco";

const editorObj = {
  html: null,
  js: null,
  css: null
}
const mode = {
  html: 'html',
  js: 'javascript',
  css: 'css'
}
let beautifier
let monaco
export default {
  name: "FormDrawer",
  props: ['formData', 'generateConf'],
  data() {
    return {
      activeTab: 'html',
      htmlCode: '',
      jsCode: '',
      cssCode: '',
      isInitCode: false,
      isRefreshCode: false,
      isIframeLoaded: false
    }
  },
  methods: {
    onOpen() {
      const { type } = this.generateConf
      this.htmlCode = cookHtml(this.formData, type)
      this.jsCode = cookJs(this.formData, type)
      this.cssCode = cookCss(this.formData)
      loadBeautifier(btf => {
        beautifier = btf
        this.htmlCode = beautifier.html(this.htmlCode, beautifierConf.html)
        this.jsCode = beautifier.js(this.jsCode, beautifierConf.js)
        this.cssCode = beautifier.css(this.cssCode, beautifierConf.html)

        loadMonaco(mo => {
          monaco = mo
          this.setEditorValue('editorHtml', 'html', this.htmlCode)
          this.setEditorValue('editorJs', 'js', this.jsCode)
          this.setEditorValue('editorCss', 'css', this.cssCode)
          // 保证iframe加载完成后再执行
          if (!this.isInitCode) {
            this.isRefreshCode = true
            this.isIframeLoaded && (this.isInitcode = true) && this.runCode()
          }
        })
      })
    },
    onClose() {

    },
    setEditorValue(id, type, codeStr) {
      if (editorObj[type]) {
        editorObj[type].setValue(codeStr)
      } else {
        editorObj[type] = monaco.editor.create(document.getElementById(id), {
          value: codeStr,
          language: mode[type],
          theme: 'vs-dark',
          automaticLayout: true
        })
      }
    },
    iframeLoad() {
      // 保证iframe加载完成后再执行
      if (!this.isInitcode) {
        this.isIframeLoaded = true
        this.isRefreshCode && (this.isInitcode = true) && this.runCode()
      }
    },
    runCode() {
      const jsCodeStr = editorObj.js.getValue()
      try {
        const ast = parse(jsCodeStr, { sourceType: 'module' })
        const astBody = ast.program.body
        if (astBody.length > 1) {
          this.$confirm(
              'js格式不能识别，仅支持修改export default的对象内容',
              '提示',
              {
                type: 'warning'
              }
          )
          return
        }
        if (astBody[0].type === 'ExportDefaultDeclaration') {
          const postData = {
            type: 'refreshFrame',
            data: {
              generateConf: this.generateConf,
              html: editorObj.html.getValue(),
              js: jsCodeStr.replace(exportDefault, ''),
              css: editorObj.css.getValue(),
            }
          }
          this.$refs.previewPage.contentWindow.postMessage(
              postData,
              location.origin
          )
        }
      } catch (err) {
        this.$message.error(`js错误：${err}`)
        console.error(err)
      }
    },
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/mixin.scss';
.tab-editor {
  position: absolute;
  top: 33px;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 14px;
}
.left-editor {
  position: relative;
  height: 100%;
  background: #1e1e1e;
  overflow: hidden;
}
.setting{
  position: absolute;
  right: 15px;
  top: 3px;
  color: #a9f122;
  font-size: 18px;
  cursor: pointer;
  z-index: 1;
}
.right-preview {
  height: 100%;
  .result-wrapper {
    height: calc(100vh - 33px);
    width: 100%;
    overflow: auto;
    padding: 12px;
    box-sizing: border-box;
  }
}
@include action-bar;
::v-deep .el-drawer__header {
  display: none;
}
</style>
