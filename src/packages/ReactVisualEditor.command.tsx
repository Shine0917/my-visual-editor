import {useCommander} from "./plugin/command.plugin";
import {ReactVisualEditorBlock, ReactVisualEditorValue} from "./ReactVisualEditor.util";
import deepcopy from "deepcopy";

export function useVisualCommand(
    {
        focusData,
        value,
        updateBlocks,
    }: {
        focusData: {
            focus: ReactVisualEditorBlock[],
            unFocus: ReactVisualEditorBlock[],
        },
        value: ReactVisualEditorValue,
        updateBlocks: (blocks: ReactVisualEditorBlock[]) => void,
    }
) {

    const commander = useCommander()

    /*删除命令*/
    commander.useRegistry({
        name: 'delete',
        keyboard: [
            'delete',
            'ctrl+d',
            'backspace',
        ],
        execute() {
            const before = deepcopy(value.blocks)
            const after = deepcopy(focusData.unFocus)
            return {
                redo: () => {
                    updateBlocks(deepcopy(after))
                },
                undo: () => {
                    updateBlocks(deepcopy(before))
                },
            }
        },
    })

    commander.useInit()

    return {
        delete: () => commander.state.commands.delete(),
        undo: () => commander.state.commands.undo(),
        redo: () => commander.state.commands.redo(),
    }
}