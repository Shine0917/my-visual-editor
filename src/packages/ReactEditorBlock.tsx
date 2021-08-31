/*
 * @Author: xiaozhaoxia
 * @Date: 2021-08-31 17:35:26
 * @LastEditTime: 2021-08-31 21:47:34
 * @LastEditors: xiaozhaoxiz
 * @FilePath: /my-visual-editor/src/packages/ReactEditorBlock.tsx
 */
import { useEffect, useMemo, useRef } from 'react'
import {
  ReactVisualEditorBlock,
  ReactVisualEditorConfig
} from './ReactVisualEditor.util'
import { useUpdate } from './hook/useUpdate'

export const ReactVisualBlock: React.FC<{
  block: ReactVisualEditorBlock
  config: ReactVisualEditorConfig
}> = props => {
  const elRef = useRef({} as HTMLDivElement)
  const { forceUpdate } = useUpdate()
  const style = useMemo(() => {
    return {
      top: `${props.block.top}px`,
      left: `${props.block.left}px`
    }
  }, [props.block.top, props.block.left])
  const component = props.config.componentMap[props.block.componentKey]
  let render: any
  if (!!component) {
    render = component.render()
  }

  useEffect(() => {
    if (props.block.adjustPosition) {
      const { top, left } = props.block
      const { height, width } = elRef.current.getBoundingClientRect()
      props.block.adjustPosition = false
      props.block.top = top - height / 2
      props.block.left = left - width / 2
      forceUpdate()
    }
  }, [])

  return (
    <div className='react-visual-editor-block' style={style} ref={elRef}>
      {render}
    </div>
  )
}
