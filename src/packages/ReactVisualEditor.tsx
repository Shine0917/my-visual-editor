/*
 * @Author: xiaozhaoxia
 * @Date: 2021-08-31 15:04:17
 * @LastEditTime: 2021-09-02 17:28:23
 * @LastEditors: xiaozhaoxiz
 * @FilePath: /My-Visual-editor/src/packages/ReactVisualEditor.tsx
 */

import './ReactVisualEditor.scss'
import { FC, useMemo, useRef,useState } from 'react'
import {
  ReactVisualEditorConfig,
  ReactVisualEditorValue,
  ReactVisualEditorComponent,
  createVisualBlock,
  ReactVisualEditorBlock
} from './ReactVisualEditor.util'
import { ReactVisualBlock } from './ReactEditorBlock'
import { useCallbackRef } from './hook/useCallbackRef'
import {useVisualCommand} from './ReactVisualEditor.command'

export interface IProps {
  value: ReactVisualEditorValue
  onChange: (val: ReactVisualEditorValue) => void
  config: ReactVisualEditorConfig
}
export const ReactVisualEditor: FC = (props: IProps) => {
  console.log('props :>> ', props)
  const [preview, setPreview] = useState(false)
  const [editing, setEditing] = useState(false)
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
            dragData.current.dragComponent = dragComponent
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
            container.dragleave
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
        /** ???????????????shift ?????????????????????????????????block, ???????????????block, ???????????????block ????????????????????? */
        if(focusData.focus.length <=1) {
          block.focus = true;
        }else {
          block.focus = !block.focus
        }
        methods.updateBlocks(props.value.blocks)
      }else {
        if(!block.focus) {
          /** ?????????????????????block ????????????????????????????????????????????????block, ?????????????????????????????????????????????block, ????????????block ??????????????? */
          block.focus = true;
          methods.clearFocus(block)
        }
      }
      setTimeout(() => blockDragger.mousedown(e),0)
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

  const blockDragger =(() => {
    
    const dragData = useRef({
      startX:0,
      startY:0,
      startPosArray:[] as {top:number, left:number}[]
    })

    const mousedown = useCallbackRef((e:React.MouseEvent<HTMLDivElement>) => {
      document.addEventListener("mousemove",mousemove),
      document.addEventListener("mouseup",mouseup),
      dragData.current ={
        startX:e.clientX,
        startY:e.clientY,
        startPosArray: focusData.focus.map(({top,left}) => ({top,left}))
      }
    })

    const mousemove = useCallbackRef((e:MouseEvent) => {
      const {startX, startY,startPosArray} = dragData.current
      const durX = e.clientX - startX, durY = e.clientY - startY
      focusData.focus.forEach((block, index) => {
        const {left, top} = startPosArray[index]
        block.top = top + durY
        block.left = left + durX
        
      })
      methods.updateBlocks(props.value.blocks)
    })

    const mouseup = useCallbackRef((e: MouseEvent) => {
      document.removeEventListener('mousemove',mousemove)
      document.removeEventListener('mouseup',mouseup)
    })

    return {mousedown}
  })()

 /**
     * ??????????????????
     * @author  ?????????
     * @date    2021/2/20 22:51
     */
  const commander = useVisualCommand({
    value: props.value,
    focusData,
    updateBlocks: methods.updateBlocks,
})

const buttons: {
    label: string | (() => string),
    icon: string | (() => string),
    tip?: string | (() => string),
    handler: () => void,
}[] = [
    {
        label: '??????', icon: 'icon-back', handler: commander.undo, tip: 'ctrl+z'
    },
    {
        label: '??????', icon: 'icon-forward', handler: commander.redo, tip: 'ctrl+y, ctrl+shift+z'
    },
    {
        label: () => preview ? '??????' : '??????',
        icon: () => preview ? 'icon-edit' : 'icon-browse',
        handler: () => {
            if (!preview) {
                methods.clearFocus()
            }
            setPreview(!preview)
        },
    },
    {
        label: '??????', icon: 'icon-import', handler: async () => {
            /*const text = await $$dialog.textarea('', {title: '??????????????????JSON?????????'})
            try {
                const data = JSON.parse(text || '')
                commander.updateValue(data)
            } catch (e) {
                console.error(e)
                notification.open({
                    message: '???????????????',
                    description: '?????????????????????????????????????????????'
                })
            }*/
        }
    },
    {
        label: '??????',
        icon: 'icon-export',
        handler: () => {
            // $$dialog.textarea(JSON.stringify(props.value), {editReadonly: true, title: '?????????JSON??????'})
        }
    },
    /*{label: '??????', icon: 'icon-place-top', handler: () => commander.placeTop(), tip: 'ctrl+up'},
    {label: '??????', icon: 'icon-place-bottom', handler: () => commander.placeBottom(), tip: 'ctrl+down'},*/
    {
        label: '??????', icon: 'icon-delete', handler: commander.delete, tip: 'ctrl+d, backspace, delete'
    },
    {
        label: '??????', icon: 'icon-reset', handler: () => {
            // commander.clear()
        },
    },
    {
        label: '??????', icon: 'icon-close', handler: () => {
            methods.clearFocus()
            setEditing(false)
        },
    },
]

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
      <div className='react-visual-editor-head'>
        {buttons.map((btn, index) => {
          const label = typeof btn.label === 'function' ? btn.label() : btn.label
          const icon = typeof btn.icon === 'function' ? btn.icon(): btn.icon
          return (
            <div className='react-visual-editor-header-btn' key={index} onClick={btn.handler}>
              <i className={`iconfont ${icon}`}></i>
              <span>{label}</span>
            </div>
          )
        })}
        </div>
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
