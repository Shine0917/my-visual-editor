/*
 * @Author: xiaozhaoxia
 * @Date: 2021-08-31 15:04:17
 * @LastEditTime: 2021-08-31 15:17:26
 * @LastEditors: xiaozhaoxiz
 * @FilePath: /My-Visual-editor/src/packages/ReactVisualEditor.tsx
 */

import './ReactVisualEditor.scss'

export const ReactVisualEditor: React.FC<{}> =() => {
  return (
    <div className="react-visual-editor">
      <div className="react-visual-editor-menu">menu</div>
      <div className="react-visual-editor-head">head</div>
      <div className="react-visual-editor-operator">operator</div>
      <div className="react-visual-editor-body">body</div>
    </div>
  )
}