import {useEffect} from "react";
import {useCallback, useRef, useState} from "react";
import {KeyboardCode} from "./keyboard.code";

export interface CommandExecute {
    undo?: () => void,
    redo: () => void,
}

interface Command {
    name: string,                                       // 命令的唯一标识
    keyboard: string | string[],                        // 命令监听的快捷键
    execute: (...args: any[]) => CommandExecute,        // 命令之后，需要返回undo和redo执行的动作
    followQueue?: boolean,                              // 命令执行完之后，是否需要将命令执行得到的undo，redo存入命令队列(全选，撤销，重做这种命令是不需要进入命令队列的)
    init?: () => ((() => void) | undefined),            // 命令初始化函数，返回值是销毁函数

}

export function useCommander() {

    const [state] = useState(() => ({
        current: -1,                                                    // 当前命令队列中，最后执行的命令返回的 CommandExecute对象
        queue: [] as CommandExecute[],                                  // 命令队列
        commandArray: [] as { current: Command }[],                     // 预定义命令的数组
        commands: {} as Record<string, (...args: any[]) => void>,       // 通过 command name执行 command动作的一个包装
        destroyList: [] as ((() => void) | undefined)[],                // 所有命令在组件销毁之前，需要执行的消除副作用的函数数组
    }))

    /**
     * 注册一个命令
     * @author  韦胜健
     * @date    2021/2/20 22:24
     */
    const useRegistry = useCallback((command: Command) => {
        const commandRef = useRef(command)
        commandRef.current = command

        useState(() => {
            if (state.commands[command.name]) {
                const existIndex = state.commandArray.findIndex(item => item.current.name === command.name)
                state.commandArray.splice(existIndex, 1)
            }
            state.commandArray.push(commandRef)
            state.commands[command.name] = (...args: any[]) => {
                const {redo, undo} = commandRef.current.execute(...args)
                redo()
                /*如果命令执行之后，不需要进入命令队列，则直接结束*/
                if (commandRef.current.followQueue === false) {
                    return
                }
                /*否则，将命令队列中剩余的命令去除，保留current及其之前的命令*/
                let {queue, current} = state
                if (queue.length > 0) {
                    queue = queue.slice(0, current + 1)
                    state.queue = queue
                }
                /*设置命令队列中最后一个命令为当前执行的命令*/
                queue.push({undo, redo})
                /*索引+1，指向队列中的最后一个命令*/
                state.current = current + 1;
            }
        })
    }, [])

    const [keyboardEvent] = useState(() => {
        const onKeydown = (e: KeyboardEvent) => {
            if (document.activeElement !== document.body) {
                return;
            }
            const {keyCode, shiftKey, altKey, ctrlKey, metaKey} = e
            let keyString: string[] = []
            if (ctrlKey || metaKey) keyString.push('ctrl')
            if (shiftKey) keyString.push('shift')
            if (altKey) keyString.push('alt')
            keyString.push(KeyboardCode[keyCode])
            const keyNames = keyString.join('+')
            state.commandArray.forEach(({current: {keyboard, name}}) => {
                if (!keyboard) {
                    return
                }
                const keys = Array.isArray(keyboard) ? keyboard : [keyboard]
                if (keys.indexOf(keyNames) > -1) {
                    state.commands[name]()
                    e.stopPropagation()
                    e.preventDefault()
                }
            })
        }
        const init = () => {
            window.addEventListener('keydown', onKeydown, true)
            return () => {window.removeEventListener('keydown', onKeydown, true)}
        }
        return {init}
    })

    /**
     * 初始化所有command的init方法
     * @author  韦胜健
     * @date    2021/2/20 22:45
     */
    const useInit = useCallback(() => {
        useState(() => {
            state.commandArray.forEach(command => !!command.current.init && state.destroyList.push(command.current.init()))
            state.destroyList.push(keyboardEvent.init())
        })

        /**
         * 注册撤回命令（撤回命令执行结果不需要进入命令队列）
         * @author  韦胜健
         * @date    2021/1/22 11:36 下午
         */
        useRegistry({
            name: 'undo',
            keyboard: 'ctrl+z',
            followQueue: false,
            execute: () => {
                return {
                    redo: () => {
                        if (state.current === -1) {
                            return
                        }
                        const queueItem = state.queue[state.current]
                        // console.log('queueItem',queueItem)
                        if (!!queueItem) {
                            !!queueItem.undo && queueItem.undo()
                            state.current--
                        }
                    },
                }
            }
        })

        /**
         * 注册重做命令（重做命令执行结果不需要进入命令队列）
         * @author  韦胜健
         * @date    2021/1/22 11:36 下午
         */
        useRegistry({
            name: 'redo',
            keyboard: [
                'ctrl+y',
                'ctrl+shift+z',
            ],
            followQueue: false,
            execute: () => {
                return {
                    redo: () => {
                        const queueItem = state.queue[state.current + 1]
                        if (!!queueItem) {
                            queueItem.redo()
                            state.current++
                        }
                    },
                }
            },
        })

    }, [])

    useEffect(() => {
        return () => {
            state.destroyList.forEach(fn => !!fn && fn())
        }
    }, [])

    return {
        state,
        useRegistry,
        useInit,
    }
}