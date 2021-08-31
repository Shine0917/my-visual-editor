/*
 * @Author: xiaozhaoxia
 * @Date: 2021-08-31 21:42:45
 * @LastEditTime: 2021-08-31 21:48:28
 * @LastEditors: xiaozhaoxiz
 * @FilePath: /my-visual-editor/src/packages/hook/useUpdate.ts
 */
import { useMemo, useState } from 'react'

export function useUpdate () {
  const [count, setCount] = useState(0)
  return useMemo(
    () => ({
      forceUpdate: () => setCount(count + 1)
    }),
    [count]
  )
}
