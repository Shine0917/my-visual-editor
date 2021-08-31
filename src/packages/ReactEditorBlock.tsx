/*
 * @Author: xiaozhaoxia
 * @Date: 2021-08-31 17:35:26
 * @LastEditTime: 2021-08-31 17:48:57
 * @LastEditors: xiaozhaoxiz
 * @FilePath: /My-Visual-editor/src/packages/ReactEditorBlock.tsx
 */
import {useMemo} from 'react';
import {ReactVisualEditorBlock, ReactVisualEditorConfig} from "./ReactVisualEditor.util";

export const ReactVisualBlock:React.FC<{
  block:ReactVisualEditorBlock,
  config:ReactVisualEditorConfig,
}> =(props) => {

  const style =useMemo(() => {
    return {
      top:`${props.block.top}px`,
      left:`${props.block.left}px`
    }
  },[props.block.top, props.block.left])
  const component = props.config.componentMap[props.block.componentKey]
  let render:any;
  if(!!component) {
    render = component.render();
  }


  return (
    <div className="react-visual-editor-block" style={style}>
      {render}
    </div>
  )
}