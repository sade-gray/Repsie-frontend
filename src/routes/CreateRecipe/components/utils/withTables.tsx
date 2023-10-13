import {BaseEditor, Range, Editor, Element as SlateElement, Point} from "slate";
import {HistoryEditor} from "slate-history";
import {ReactEditor} from "slate-react";

export const withTables = (editor: BaseEditor & ReactEditor & HistoryEditor) => {
    const {deleteBackward, deleteForward, insertBreak} = editor;

    editor.deleteBackward = (unit) => {
        const {selection} = editor;

        if (selection && Range.isCollapsed(selection)) {
            const [cell] = Editor.nodes(editor, {
                match: (n) =>
                    // @ts-ignore
                    !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "table-cell",
            });

            if (cell) {
                const [, cellPath] = cell;
                const start = Editor.start(editor, cellPath);

                if (Point.equals(selection.anchor, start)) {
                    return;
                }
            }
        }

        deleteBackward(unit);
    };

    editor.deleteForward = (unit) => {
        const {selection} = editor;

        if (selection && Range.isCollapsed(selection)) {
            const [cell] = Editor.nodes(editor, {
                match: (n) =>
                    // @ts-ignore
                    !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "table-cell",
            });

            if (cell) {
                const [, cellPath] = cell;
                const end = Editor.end(editor, cellPath);

                if (Point.equals(selection.anchor, end)) {
                    return;
                }
            }
        }

        deleteForward(unit);
    };

    editor.insertBreak = () => {
        const {selection} = editor;

        if (selection) {
            const [table] = Editor.nodes(editor, {
                match: (n) =>
                    // @ts-ignore
                    !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "table",
            });

            if (table) {
                return;
            }
        }

        insertBreak();
    };

    return editor;
};
