<!--
 * @Author: xiaozhaoxia
 * @Date: 2021-08-31 14:48:57
 * @LastEditTime: 2021-08-31 14:58:55
 * @LastEditors: xiaozhaoxiz
 * @FilePath: /My-Visual-editor/README.md
-->

1. 实现对页面某个节点的拖拽
  * 给需要拖拽的节点绑定 `mousedown`, `mousemove`, `mouseup` 事件
  * `mousedown` 事件触发后, 开始拖拽
  * `mousemove` 时，需要通过 `event.clientX `和`event.clientY` 获取拖拽位置，并实时更新位置
  * `mouseup` 时，拖拽结束
  * 如果用原生js 实现，需要注意浏览器边界的情况
