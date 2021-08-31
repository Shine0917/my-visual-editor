/*
 * @Author: xiaozhaoxia
 * @Date: 2021-08-31 15:04:17
 * @LastEditTime: 2021-08-31 21:29:52
 * @LastEditors: xiaozhaoxiz
 * @FilePath: /my-visual-editor/src/packages/ReactVisualEditor.tsx
 */

import './ReactVisualEditor.scss'
import { FC, useMemo, useRef } from 'react'
import {
  ReactVisualEditorConfig,
  ReactVisualEditorValue,
  ReactVisualEditorComponent,
  createVisualBlock
} from './ReactVisualEditor.util'
import { ReactVisualBlock } from './ReactEditorBlock'
import { useCallbackRef } from './hook/useCallbackRef'

export interface IProps {
  value: ReactVisualEditorValue
  onChange: (val: ReactVisualEditorValue) => void
  config: ReactVisualEditorConfig
}
export const ReactVisualEditor: FC = (props: IProps) => {
  console.log('props :>> ', props)
  const containerRef = useRef({} as HTMLDivElement)
  const containerStyle = useMemo(() => {
    return {
      height: `${props.value.container.height}px`,
      width: `${props.value.container.width}px`
    }
  }, [props.value.container.height, props.value.container.width])

  const menuDragger = (() => {
    const dragData = useRef({
      dragComponent: null as null | ReactVisualEditorComponent
    })
    const block = {
      dragstart: useCallbackRef(
        (
          e: React.DragEvent<HTMLDivElement>,
          dragComponent: ReactVisualEditorComponent
        ) => {
          containerRef.current.addEventListener(
            'dragenter',
            container.dragenter
          ),
            containerRef.current.addEventListener(
              'dragover',
              container.dragover
            ),
            containerRef.current.addEventListener(
              'dragleave',
              container.dragleave
            ),
            containerRef.current.addEventListener('drop', container.drop),
            (dragData.current.dragComponent = dragComponent)
        }
      ),
      dragend: useCallbackRef((e: React.DragEvent<HTMLDivElement>) => {
        containerRef.current.removeEventListener(
          'dragenter',
          container.dragenter
        )
        containerRef.current.removeEventListener(
          'dragover',
          container.dragover
        ),
          containerRef.current.removeEventListener(
            'dragleave',
            container.dragenter
          )
        containerRef.current.removeEventListener('drop', container.drop)
      })
    }

    const container = {
      dragenter: useCallbackRef((e: DragEvent) => {
        e.dataTransfer!.dropEffect = 'move'
      }),
      dragover: useCallbackRef((e: DragEvent) => {
        e.preventDefault()
      }),
      dragleave: useCallbackRef((e: DragEvent) => {
        e.dataTransfer!.dropEffect = 'none'
      }),
      drop: useCallbackRef((e: DragEvent) => {
        props.onChange({
          ...props.value,
          blocks: [
            ...props.value.blocks,
            createVisualBlock({
              top: e.offsetY,
              left: e.offsetX,
              component: dragData.current.dragComponent!
            })
          ]
        })
      })
    }
    return block
  })()

  return (
    <div className='react-visual-editor'>
      <div className='react-visual-editor-menu'>
        {props.config.componentArray.map((component, index) => (
          <div
            className='react-visual-editor-menu-item'
            key={index}
            draggable
            onDragStart={e => menuDragger.dragstart(e, component)}
            onDragEnd={menuDragger.dragend}
          >
            {component.preview()}
            <div className='react-visual-editor-menu-item-name'>
              {component.name}
            </div>
          </div>
        ))}
      </div>
      <div className='react-visual-editor-head'>head</div>
      <div className='react-visual-editor-operator'>operator</div>
      <div className='react-visual-editor-body'>
        <div
          className='react-visual-editor-container'
          style={containerStyle}
          ref={containerRef}
        >
          {props?.value?.blocks.map((block, index) => (
            <ReactVisualBlock
              key={index}
              block={block}
              config={props.config}
            ></ReactVisualBlock>
          ))}
        </div>
      </div>
    </div>
  )
}
