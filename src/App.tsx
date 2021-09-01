import './app.scss'
import { useState, useRef, useCallback, useMemo } from 'react'
import { useCallbackRef } from './packages/hook/useCallbackRef'
import { ReactVisualEditor } from './packages/ReactVisualEditor'
import { visualConfig } from './visual.config'
import { ReactVisualEditorValue } from './packages/ReactVisualEditor.util'
const App = () => {
  const [pos, setPos] = useState({
    left: 0,
    top: 0
  })

  const [editorValue, setEditorValue] = useState(() => {
    const val: ReactVisualEditorValue = {
      container: {
        height: 500,
        width: 1000
      },
      blocks: [
        {
          componentKey: 'text',
          top: 100,
          left: 100,
          adjustPosition: false,
          focus: false,
        },
        {
          componentKey: 'button',
          top: 200,
          left: 200,
          adjustPosition: false,
          focus: false,

        },
        {
          componentKey: 'input',
          top: 300,
          left: 300,
          adjustPosition: false,
          focus: false,

        }
      ]
    }
    return val
  })

  const posRef = useRef(pos)
  posRef.current = pos

  const mouseDragger = (() => {
    const dragData = useRef({
      startTop: 0, // 拖拽开始的时候，block 的top值
      startLeft: 0, // 拖拽开始的时候，block 的left 值
      startX: 0, // 拖拽开始的时候，鼠标的left值
      startY: 0 // 拖拽开始的时候，鼠标的top值
    })

    const mousedown = (e: React.MouseEvent<HTMLDivElement>) => {
      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseup)
      dragData.current = {
        startTop: pos.top,
        startLeft: pos.left,
        startX: e.clientX,
        startY: e.clientY
      }
    }

    const mousemove = useCallbackRef((e: MouseEvent) => {
      /*在move的过程中，需要获取一些hook变量*/
      console.log({
        pos: `${pos.top}_${pos.left}`,
        ref: `${posRef.current.top}_${posRef.current.left}`
      })

      const { startTop, startLeft, startX, startY } = dragData.current
      const durX = e.clientX - startX
      const durY = e.clientY - startY
      setPos({
        top: startTop + durY,
        left: startLeft + durX
      })
    })
    const mouseup = (e: MouseEvent) => {
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)
    }

    return {
      mousedown
    }
  })()
  return (
    <div className='app-home'>
      {/* <h1 className="test">hello world</h1>
        <div style={{
          height: '50px',
          width: '50px',
          backgroundColor:'black',
          position: 'relative',
          top:`${pos.top}px`,
          left:`${pos.left}px`,
          display: 'inline-block'
        }}
        onMouseDown={mouseDragger.mousedown}
        ></div> */}
      <ReactVisualEditor
        config={visualConfig}
        value={editorValue}
        onChange={setEditorValue}
      ></ReactVisualEditor>
    </div>
  )
}

export default App
