import React, {Dispatch, SetStateAction, useCallback, useState} from "react";
import {BaseEditor, createEditor, Descendant, Editor, Transforms, Element as SlateElement} from "slate";
import {Slate, Editable, withReact, ReactEditor, useSlate} from "slate-react";
import {withHistory} from "slate-history";
import * as Icons from "@mui/icons-material";
import {Box, Divider, Icon, IconButton} from "@mui/material";
import isHotkey from "is-hotkey";
import "../styles.scss";

declare module "slate" {
    export interface CustomTypes {
        Editor: CustomEditor;
        Text: CustomText;
        Element: CustomElement;
    }
}

export type CustomText = {
    text: string;
    bold?: boolean | false;
    italic?: boolean | false;
    underline?: boolean | false;
    type: string;
    children: Descendant[];
};

export type CustomElement = {
    type: string;
    children: Descendant[];
};

interface CustomEditor extends BaseEditor, ReactEditor {
    type: string;
}

type EditorProps = {
    recipeData: Descendant[];
    setRecipeData?: Dispatch<SetStateAction<Descendant[]>>;
    readOnly?: boolean;
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const FORMAT_HOTKEYS: {[key: string]: string} = {
    "mod+b": "bold",
    "mod+i": "italic",
    "mod+u": "underline",
};

const BLOCK_HOTKEYS: {[key: string]: string} = {
    "mod+1": "heading-one",
    "mod+2": "heading-two",
    "mod+e": "center",
};

export default function SlateEditor({recipeData, setRecipeData, readOnly}: EditorProps) {
    const [editor] = useState(() => withHistory(withReact(createEditor())));
    // This is the logic for rendering every node according to its type
    const renderElement = useCallback((props: any) => <Element {...props} />, []);
    const renderLeaf = useCallback((props: any) => {
        return <Leaf {...props} />;
    }, []);

    return (
        <div className='editor'>
            <Box
                sx={{
                    border: !readOnly ? "2px solid" : "none",
                    borderColor: "secondary.main",
                }}>
                <Slate
                    editor={editor}
                    initialValue={recipeData}
                    onChange={(value) => {
                        !readOnly && setRecipeData?.(value);
                        console.log(JSON.stringify(value));
                    }}>
                    {!readOnly && (
                        <div>
                            <div className='editor--buttons'>
                                <MarkButton format='bold' icon='FormatBold' />
                                <MarkButton format='italic' icon='FormatItalic' />
                                <MarkButton format='underline' icon='FormatUnderlined' />
                                <BlockButton format='heading-one' icon='LooksOne' />
                                <BlockButton format='heading-two' icon='LooksTwo' />
                                <BlockButton format='bulleted-list' icon='FormatListBulleted' />
                                <BlockButton format='numbered-list' icon='FormatListNumbered' />
                                <BlockButton format='left' type='align' icon='FormatAlignLeft' />
                                <BlockButton format='center' type='align' icon='FormatAlignCenter' />
                                <BlockButton format='right' type='align' icon='FormatAlignRight' />
                                <BlockButton format='justify' type='align' icon='FormatAlignJustify' />
                            </div>
                            <Divider color='secondary' />
                        </div>
                    )}

                    <Box
                        sx={{
                            width: "40vw",
                            minInlineSize: "100%",
                        }}>
                        <Editable
                            style={{
                                outline: 0,
                                padding: 2,
                                minHeight: "40vh",
                            }}
                            readOnly={readOnly}
                            renderElement={renderElement}
                            renderLeaf={renderLeaf}
                            onKeyDown={(event) => {
                                for (const hotkey in FORMAT_HOTKEYS) {
                                    if (isHotkey(hotkey, event)) {
                                        event.preventDefault();
                                        const mark = FORMAT_HOTKEYS[hotkey];
                                        toggleMark(editor, mark);
                                    }
                                }
                                for (const hotkey in BLOCK_HOTKEYS) {
                                    if (isHotkey(hotkey, event)) {
                                        event.preventDefault();
                                        const mark = BLOCK_HOTKEYS[hotkey];
                                        toggleBlock(editor, mark);
                                    }
                                }

                                const {selection} = editor;

                                if (event.key === "Enter") {
                                    if (selection) {
                                        const [start] = Editor.nodes(editor, {
                                            at: selection,
                                            match: (n) =>
                                                !Editor.isEditor(n) &&
                                                SlateElement.isElement(n) &&
                                                n.type.startsWith("heading"),
                                        });

                                        if (start) {
                                            const [node, path] = start;
                                            const [end] = Editor.nodes(editor, {
                                                at: Editor.end(editor, selection),
                                                match: (n) => n === node,
                                            });

                                            if (end) {
                                                event.preventDefault();
                                                const newLine = {
                                                    type: "paragraph",
                                                    children: [{text: ""}],
                                                };
                                                // @ts-ignore
                                                Transforms.insertNodes(editor, newLine, {
                                                    at: Editor.after(editor, path),
                                                });
                                                // @ts-ignore
                                                Transforms.select(editor, Editor.after(editor, path));
                                                return;
                                            }
                                        }
                                    }
                                }

                                if (
                                    event.key === "Backspace" &&
                                    selection &&
                                    Editor.start(editor, selection).offset === 0
                                ) {
                                    const [match] = Editor.nodes(editor, {
                                        match: (n) => Editor.isBlock(editor, n) && n.type === "list-item",
                                    });

                                    if (match) {
                                        const [, path] = match;
                                        const listItemPath = path.slice(0, path.length - 1); // Remove last index to get the list item
                                        const listNode = Editor.node(editor, listItemPath);

                                        if (
                                            listNode &&
                                            SlateElement.isElement(listNode[0]) &&
                                            listNode[0].children.length === 1
                                        ) {
                                            // If there is only one bullet, exit the list
                                            event.preventDefault();
                                            Transforms.unwrapNodes(editor, {
                                                match: (n) => LIST_TYPES.includes(n.type),
                                                split: true,
                                            });
                                            Transforms.setNodes(editor, {type: "paragraph"});
                                        }
                                    }
                                }
                            }}
                        />
                    </Box>
                </Slate>
            </Box>
        </div>
    );
}

const toggleBlock = (editor: CustomEditor, format: string) => {
    const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? "align" : "type");
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes(n.type) &&
            !TEXT_ALIGN_TYPES.includes(format),
        split: true,
    });

    let properties = {};
    if (TEXT_ALIGN_TYPES.includes(format)) {
        properties = {
            align: isActive ? undefined : format,
        };
    } else {
        properties = {
            type: isActive ? "paragraph" : isList ? "list-item" : format,
        };
    }

    Transforms.setNodes(editor, properties);

    if (!isActive && isList) {
        const block = {type: format, children: []};
        Transforms.wrapNodes(editor, block);
    }
};

const toggleMark = (editor: CustomEditor, format: string) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const isBlockActive = (editor: CustomEditor, format: string, blockType: string = "type") => {
    const {selection} = editor;
    if (!selection) return false;

    const [match] = Array.from(
        Editor.nodes<SlateElement>(editor, {
            at: Editor.unhangRange(editor, selection),
            match: (n) =>
                !Editor.isEditor(n) && SlateElement.isElement(n) && (n as {[key: string]: any})[blockType] === format,
        })
    );

    return !!match;
};

const isMarkActive = (editor: CustomEditor, format: string) => {
    const marks: any = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

type ButtonProps = {
    icon: keyof typeof Icons;
    format: string;
    type?: string;
};

const MarkButton = ({icon, format}: ButtonProps) => {
    const editor = useSlate();
    return (
        <IconButton
            onMouseDown={(event) => {
                event.preventDefault();
                toggleMark(editor, format);
            }}>
            <Icon color={isMarkActive(editor, format) ? "secondary" : "disabled"}>
                {React.createElement(Icons[icon])}
            </Icon>
        </IconButton>
    );
};

const BlockButton = ({icon, format, type}: ButtonProps) => {
    const editor = useSlate();
    return (
        <IconButton
            onMouseDown={(event) => {
                event.preventDefault();
                toggleBlock(editor, format);
            }}>
            <Icon color={isBlockActive(editor, format, type) ? "secondary" : "disabled"}>
                {React.createElement(Icons[icon])}
            </Icon>
        </IconButton>
    );
};

const Element = ({attributes, children, element}: any) => {
    const style = {textAlign: element.align};
    switch (element.type) {
        case "heading-one":
            return (
                <h1 style={style} {...attributes}>
                    {children}
                </h1>
            );
        case "heading-two":
            return (
                <h2 style={style} {...attributes}>
                    {children}
                </h2>
            );
        case "bulleted-list":
            return (
                <ul className='bulleted--list' {...attributes}>
                    {children}
                </ul>
            );
        case "numbered-list":
            return (
                <ol className='numbered--list' {...attributes}>
                    {children}
                </ol>
            );
        case "list-item":
            return <li {...attributes}>{children}</li>;
        // TODO: Add support for images
        default:
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            );
    }
};

const Leaf = ({attributes, children, leaf}: any) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }

    if (leaf.italic) {
        children = <em>{children}</em>;
    }

    if (leaf.underline) {
        children = <u>{children}</u>;
    }

    return <span {...attributes}>{children}</span>;
};
