<template>
  <div>
    <el-drawer
        v-bind="$attrs"
        v-on="$listeners"
        @opened="onOpen"
        @close="onClose"
    >
      <div class="action-bar" :style="{'text-align': 'left'}">
        <span class="bar-btn" @click="refresh">
          <i class="el-icon-refresh" />
          刷新
        </span>
        <span ref="copyBtn" class="bar-btn copy-json-btn">
          <i class="el-icon-document-copy" />
          复制JSON
        </span>
        <span class="bar-btn" @click="exportJsonFile">
          <i class="el-icon-download" />
          导出JSON文件
        </span>
        <span class="bar-btn delete-btn" @click="$emit('update:visible', false)">
          <i class="el-icon-circle-close" />
          关闭
        </span>
      </div>
      <div id="editorJson" class="json-editor" />
    </el-drawer>
  </div>
</template>

<script>
import loadBeautifier from "@/utils/loadBeautifer";
import {beautifierConf} from "@/utils";
import loadMonaco from "@/utils/loadMonaco";
import {saveAs} from "file-saver";
import ClipboardJS from "clipboard";
// eslint-disable-next-line no-unused-vars
let beautifier;
let monaco;
export default {
  name: "JsonDrawer",
  inheritAttrs: false,
  props: {
    jsonStr: {
      type: String,
      required: true
    }
  },
  mounted() {
    window.addEventListener('keydown', this.preventDefaultSave)
    const clipboard = new ClipboardJS('.copy-json-btn', {
      text: () => {
        this.$notify({
          title: '成功',
          message: '代码已复制到剪切板，可粘贴。',
          type: 'success'
        })
        return this.beautifierJson
      }
    })
    clipboard.on('error', () => {
      this.$message.error('复制失败，请手动复制')
    })
  },
  methods: {
    preventDefaultSave(e) {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
      }
    },
    onOpen() {
      loadBeautifier(btf => {
        let beautifier = btf;
        this.beautifierJson = beautifier.js(this.jsonStr, beautifierConf.js)

        loadMonaco(mco => {
          monaco = mco;
          this.setEditorValue('editorJson', this.beautifierJson)
        })
      })
    },
    setEditorValue(id, codeStr) {
      if(this.editor) {
        this.editor.setValue(codeStr)
      } else {
        this.editor = monaco.editor.create(document.getElementById(id), {
          value: codeStr,
          theme: 'vs-dark',
          language: 'json',
          automaticLayout: true
        })
        // ctrl + s 刷新
        this.editor.onKeyDown(e => {
          if (e.keyCode === 49 && (e.metaKey || e.ctrlKey)) {
            this.refresh()
          }
        })
      }
    },
    onClose() {},
    refresh() {
      try {
        this.$emit('refresh', JSON.parse(this.jsonEditor.getValue()))
      } catch (error) {
        this.$notify({
          title: '错误',
          message: 'JSON格式错误，请检查',
          type: 'error'
        })
      }
    },
    exportJsonFile() {
      this.$prompt('文件名:', '导出文件', {
        inputValue: `${+new Date()}.json`,
        closeOnClickModal: false,
        inputPlaceholder: '请输入文件名'
      }).then(({ value }) => {
        if (!value) value = `${+new Date()}.json`
        const codeStr = this.editor.getValue()
        const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
        saveAs(blob, value)
      })
    },
  }
}
</script>


<style scoped lang="scss">
@import '@/styles/mixin.scss';

::v-deep .el-drawer__header {
  display: none;
}
@include action-bar;

.json-editor{
  height: calc(100vh - 33px);
}
</style>
