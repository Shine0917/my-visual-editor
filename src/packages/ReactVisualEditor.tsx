/*
 * @Author: xiaozhaoxia
 * @Date: 2021-08-31 15:04:17
 * @LastEditTime: 2021-08-31 17:57:08
 * @LastEditors: xiaozhaoxiz
 * @FilePath: /My-Visual-editor/src/packages/ReactVisualEditor.tsx
 */

import './ReactVisualEditor.scss'
import {FC, useMemo} from 'react'
import {ReactVisualEditorConfig, ReactVisualEditorValue} from "./ReactVisualEditor.util";
import { ReactVisualBlock } from './ReactEditorBlock';

export interface IProps {
  value:ReactVisualEditorValue,
  onChange: (val:ReactVisualEditorValue) =>void,
  config: ReactVisualEditorConfig,
}
export const ReactVisualEditor:FC = (props:IProps) => {
  console.log('props :>> ', props);
  const containerStyle = useMemo(() => {
    return {
      height: `${props.value.container.height}px`,
      width: `${props.value.container.width}px`,
    }
  },[props.value.container.height, props.value.container.width]) 

  return (
    <div className="react-visual-editor">
      <div className="react-visual-editor-menu">
        {props.config.componentArray.map((component,index) => 
           <div className="react-visual-editor-menu-item" key={index}>
            {component.preview()}
            <div className="react-visual-editor-menu-item-name">
              {component.name}
            </div>
          </div>
        )}
        
        </div>
      <div className="react-visual-editor-head">head</div>
      <div className="react-visual-editor-operator">operator</div>
      <div className="react-visual-editor-body">
        <div className="react-visual-editor-container" style={containerStyle}>
          {props?.value?.blocks.map((block, index) => (
            <ReactVisualBlock key={index} block={block} config={props.config}></ReactVisualBlock>
          ))}
        </div>
        </div>
    </div>
  )
}