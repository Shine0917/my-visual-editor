/*
 * @Author: xiaozhaoxia
 * @Date: 2021-08-31 15:28:56
 * @LastEditTime: 2021-08-31 21:46:05
 * @LastEditors: xiaozhaoxiz
 * @FilePath: /my-visual-editor/src/packages/ReactVisualEditor.util.tsx
 */

export interface ReactVisualEditorBlock {
  componentKey: string
  top: number
  left: number
  adjustPosition: boolean
}

export interface ReactVisualEditorValue {
  container: {
    height: number
    width: number
  }
  blocks: ReactVisualEditorBlock[]
}

export interface ReactVisualEditorComponent {
  key: string
  name: string
  preview: () => JSX.Element
  render: () => JSX.Element
}

export function createVisualBlock ({
  top,
  left,
  component
}: {
  top: number
  left: number
  component: ReactVisualEditorComponent
}): ReactVisualEditorBlock {
  return {
    componentKey: component.key,
    top,
    left,
    adjustPosition: true
  }
}

export function createVisualConfig () {
  const componentMap: { [k: string]: ReactVisualEditorComponent } = {}

  const componentArray: ReactVisualEditorComponent[] = []

  function registerComponent (
    key: string,
    option: Omit<ReactVisualEditorComponent, 'key'>
  ) {
    if (componentMap[key]) {
      const index = componentArray.indexOf(componentMap[key])
      componentArray.splice(index, 1)
    }

    const newComponent = {
      key,
      ...option
    }
    componentArray.push(newComponent)
    componentMap[key] = newComponent
  }

  return {
    componentMap,
    componentArray,
    registerComponent
  }
}

export type ReactVisualEditorConfig = ReturnType<typeof createVisualConfig>
