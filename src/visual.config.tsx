/*
 * @Author: xiaozhaoxia
 * @Date: 2021-08-31 16:42:17
 * @LastEditTime: 2021-08-31 16:46:51
 * @LastEditors: xiaozhaoxiz
 * @FilePath: /My-Visual-editor/src/packages/visual.config.tsx
 */
import {createVisualConfig} from './packages/ReactVisualEditor.util';
import { Button, Input} from 'antd'

export const visualConfig = createVisualConfig()

visualConfig.registerComponent('text', {
  name:'文本',
  preview: () => <span>预览文本</span>,
  render: () => <span>渲染文本</span>
})

visualConfig.registerComponent('button', {
  name: '按钮',
  preview: () => <Button type="primary">预览的按钮</Button>,
  render: () => <Button type="primary">渲染的按钮</Button>
})

visualConfig.registerComponent('input', {
  name: '输入框',
  preview: () => <Input />,
  render: () => <Input />
})