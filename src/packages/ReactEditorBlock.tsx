/*
 * @Author: xiaozhaoxia
 * @Date: 2021-08-31 17:35:26
 * @LastEditTime: 2021-09-01 13:51:39
 * @LastEditors: xiaozhaoxiz
 * @FilePath: /My-Visual-editor/src/packages/ReactEditorBlock.tsx
 */
import { useEffect, useMemo, useRef } from 'react'
import {
  ReactVisualEditorBlock,
  ReactVisualEditorConfig
} from './ReactVisualEditor.util'
import { useUpdate } from './hook/useUpdate'
import classNames from 'classnames'

export const ReactVisualBlock: React.FC<{
  block: ReactVisualEditorBlock
  config: ReactVisualEditorConfig,
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void
}> = props => {
  const elRef = useRef({} as HTMLDivElement)
  const { forceUpdate } = useUpdate()
  const style = useMemo(() => {
    return {
      top: `${props.block.top}px`,
      left: `${props.block.left}px`,
      opacity: props.block.adjustPosition ? '0' : ''
    }
  }, [props.block.top, props.block.left, props.block.adjustPosition])

  const classes = useMemo(() => 
    classNames(['react-visual-editor-block',{
      'react-visual-editor-block-focus': props.block.focus,
    }])
  ,[props.block.focus])
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
    <div className={classes} style={style} ref={elRef} onMouseDown={props.onMouseDown}>
      {render}
    </div>
  )
}
