/*
 * @Author: xiaozhaoxia
 * @Date: 2021-08-31 15:04:17
 * @LastEditTime: 2021-09-01 13:51:16
 * @LastEditors: xiaozhaoxiz
 * @FilePath: /My-Visual-editor/src/packages/ReactVisualEditor.tsx
 */

import './ReactVisualEditor.scss'
import { FC, useMemo, useRef } from 'react'
import {
  ReactVisualEditorConfig,
  ReactVisualEditorValue,
  ReactVisualEditorComponent,
  createVisualBlock,
  ReactVisualEditorBlock
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

  const focusData = useMemo(() => {
    const focus: ReactVisualEditorBlock[] =[]
    const unFocus: ReactVisualEditorBlock[] =[]
    props.value.blocks.forEach(block => {(block.focus ? focus: unFocus).push(block)})
    return {focus, unFocus}
  },[props.value.blocks])

  const methods ={
    updateBlocks:(blocks: ReactVisualEditorBlock[]) => {props.onChange({...props.value, blocks:[...blocks]})},
    clearFocus:(external?: ReactVisualEditorBlock) => {
      (!!external ? focusData.focus.filter(item => item !== external) : focusData.focus).forEach(block => {block.focus =false})
      methods.updateBlocks(props.value.blocks)
    }
  }

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


  const focusHandler =(() => {
    const block =(e: React.MouseEvent<HTMLDivElement>, block:ReactVisualEditorBlock) => {
      if(e.shiftKey){
        /** 如果按住了shift 键，如果此时没有选中的block, 就选中这个block, 否则令这个block 的选中状态取反 */
        if(focusData.focus.length <=1) {
          block.focus = true;
        }else {
          block.focus = !block.focus
        }
        methods.updateBlocks(props.value.blocks)
      }else {
        if(!block.focus) {
          /** 如果点击的这个block 没有被选中，才清空这个其他的选中block, 否则不做任何事情，放置拖拽多个block, 取消其他block 的选中状态 */
          block.focus = true;
          methods.clearFocus(block)
        }
      }
    }

    const container = (e: React.MouseEvent<HTMLDivElement>) => {
      if(e.target !== e.currentTarget) {
        return
      }

      if(!e.shiftKey) {
        methods.clearFocus()
      }
    }
    return {
      block,
      container,
    }
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
          onMouseDown={focusHandler.container}
        >
          {props?.value?.blocks.map((block, index) => (
            <ReactVisualBlock
              key={index}
              block={block}
              config={props.config}
              onMouseDown={e => focusHandler.block(e,block)}

            ></ReactVisualBlock>
          ))}
        </div>
      </div>
    </div>
  )
}
