<script>
import render from "@/components/render/render";

const components = {
  itemBtns (h, currentItem, index, list) {
    const { copyItem, deleteItem } = this.$listeners;
    return [
      <span class="drawing-item-copy" title="复制" onClick={event => {
        copyItem(currentItem, list); event.stopPropagation()
      }}>
        <i class="el-icon-copy-document" />
      </span>,
      <span class="drawing-item-delete" title="删除" onClick={event => {
        deleteItem(index, list); event.stopPropagation()
      }}>
        <i class="el-icon-delete" />
      </span>
    ]
  }
}

const layouts = {
  // eslint-disable-next-line no-unused-vars
  colFormItem(h, currentItem, index, list) {
    const { activeItem } = this.$listeners
    const config = currentItem.__config__;
    let className = this.activeId === config.formId ? "drawing-item active-from-item" : "drawing-item";
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    if (config.showLabel === false) labelWidth = "0";
    return (
      <el-col span={config.span} class={className}
        nativeOnClick={event => { activeItem(currentItem); event.stopPropagation() }}>
        <el-form-item label={config.showLabel ? config.label : ''} required={config.required} prop={config.__vModel__} label-width={labelWidth} rules={config.regList}>
          <render key={config.renderKey} conf={currentItem} onInput={event => {
            this.$set(config, 'defaultValue', event)
          }}>
          </render>
        </el-form-item>
        {components.itemBtns.apply(this, arguments)}
      </el-col>
    );
  },
}
export default {
  name: "DraggableItem",
  props: ["currentItem", "index", "drawingList", "activeId", "formConf"],
  // eslint-disable-next-line vue/require-render-return
  render(h) {
    const layout = layouts[this.currentItem.__config__.layout];
    if (layout) return layout.call(this, h, this.currentItem, this.index, this.drawingList);
  }
}
</script>
