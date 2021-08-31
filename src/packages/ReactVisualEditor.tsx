/*
 * @Author: xiaozhaoxia
 * @Date: 2021-08-31 15:04:17
 * @LastEditTime: 2021-08-31 17:24:15
 * @LastEditors: xiaozhaoxiz
 * @FilePath: /My-Visual-editor/src/packages/ReactVisualEditor.tsx
 */

import './ReactVisualEditor.scss'
import {FC} from 'react'
import {ReactVisualEditorConfig, ReactVisualEditorValue} from "./ReactVisualEditor.util";

export interface IProps {
  value:ReactVisualEditorValue,
  onChange: (val:ReactVisualEditorValue) =>void,
  config: ReactVisualEditorConfig,
}
export const ReactVisualEditor:FC = (props:IProps) => {
  console.log('props :>> ', props);
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
      <div className="react-visual-editor-body">body</div>
    </div>
  )
}