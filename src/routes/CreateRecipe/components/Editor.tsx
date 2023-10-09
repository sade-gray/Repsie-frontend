import React, {useCallback, useState} from "react";
import {BaseEditor, createEditor, Descendant, Editor, Transforms} from "slate";
import {Slate, Editable, withReact, ReactEditor, useSlate} from "slate-react";
import {withHistory} from "slate-history";
import * as Icons from "@mui/icons-material";
import {Box, Button, Divider, Icon, IconButton} from "@mui/material";
import isHotkey from "is-hotkey";
import "../styles.scss";
import {Save} from "@mui/icons-material";

declare module "slate" {
    export interface CustomTypes {
        Editor: BaseEditor & ReactEditor;
        Text: CustomText;
    }
}

export type CustomText = {
    text: string;
    bold?: boolean | false;
    italic?: boolean | false;
    underline?: boolean | false;
    type?: string;
};

type InitialProps = {
    inital: string;
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const FORMAT_HOTKEYS: {[key: string]: string} = {
    "mod+b": "bold",
    "mod+i": "italic",
    "mod+u": "underline",
};

const BLOCK_HOTKEYS: {[key: string]: string} = {
    "mod+1": "heading-one",
    "mod+2": "heading-two",
};

export default function SlateEditor({inital}: InitialProps) {
    const initialValue = [
        {
            type: "paragraph",
            children: [{text: inital}],
        },
    ];
    const [value, setValue] = useState<Descendant[]>(initialValue);
    const [editor] = useState(() => withReact(withHistory(createEditor())));
    // This is the logic for rendering every node according to its type
    const renderElement = useCallback((props: any) => <Element {...props} />, []);
    const renderLeaf = useCallback((props: any) => {
        return <Leaf {...props} />;
    }, []);

    return (
        <div
            style={{
                fontWeight: "initial",
            }}>
            <Box
                sx={{
                    border: "2px solid",
                    borderColor: "secondary.main",
                }}>
                <Slate
                    editor={editor}
                    initialValue={value}
                    onChange={(value) => {
                        setValue(value);
                        console.log(JSON.stringify(value));
                    }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "start",
                            flexWrap: "wrap",
                            backgroundColor: "secondary.main",
                        }}>
                        <MarkButton format='bold' icon='FormatBold' />
                        <MarkButton format='italic' icon='FormatItalic' />
                        <MarkButton format='underline' icon='FormatUnderlined' />
                        <BlockButton format='heading-one' icon='LooksOne' />
                        <BlockButton format='heading-two' icon='LooksTwo' />
                        <BlockButton format='bulleted-list' icon='FormatListBulleted' />
                        <BlockButton format='numbered-list' icon='FormatListNumbered' />
                    </Box>
                    <Divider />
                    <Box
                        sx={{
                            width: "400px",
                            height: "200px",
                            overflow: "scroll",
                            overflowX: "hidden",
                        }}>
                        <Editable
                            style={{
                                height: "100%",
                                outline: 0,
                                padding: 5,
                            }}
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
                            }}
                        />
                    </Box>
                </Slate>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        margin: 5,
                    }}>
                    <Button
                        color='secondary'
                        variant='contained'
                        size='medium'
                        startIcon={<Save />}>
                        Save
                    </Button>
                </div>
            </Box>
        </div>
    );
}

const toggleBlock = (editor: BaseEditor & ReactEditor, format: string) => {
    const isActive = isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
        // @ts-ignore
        match: (n) => LIST_TYPES.includes(n.type),
        split: true,
    });

    Transforms.setNodes(editor, {
        type: isActive ? "paragraph" : isList ? "list-item" : format,
    });

    if (!isActive && isList) {
        const block = {type: format, children: []};
        Transforms.wrapNodes(editor, block);
    }
};

const toggleMark = (editor: BaseEditor & ReactEditor, format: string) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const isBlockActive = (editor: BaseEditor & ReactEditor, format: string) => {
    const [match] = Editor.nodes(editor, {
        // @ts-ignore
        match: (n) => n.type === format,
    });

    return !!match;
};

const isMarkActive = (editor: BaseEditor & ReactEditor, format: string) => {
    const marks: any = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

type ButtonProps = {
    icon: keyof typeof Icons;
    format: string;
};

const MarkButton = ({icon, format}: ButtonProps) => {
    const editor = useSlate();
    return (
        <IconButton
            onMouseDown={(event) => {
                event.preventDefault();
                toggleMark(editor, format);
            }}>
            <Icon color={isMarkActive(editor, format) ? "primary" : "disabled"}>
                {React.createElement(Icons[icon])}
            </Icon>
        </IconButton>
    );
};

const BlockButton = ({icon, format}: ButtonProps) => {
    const editor = useSlate();
    return (
        <IconButton
            onMouseDown={(event) => {
                event.preventDefault();
                toggleBlock(editor, format);
            }}>
            <Icon color={isBlockActive(editor, format) ? "primary" : "disabled"}>
                {React.createElement(Icons[icon])}
            </Icon>
        </IconButton>
    );
};

const Element = ({attributes, children, element}: any) => {
    switch (element.type) {
        case "heading-one":
            return <h1 {...attributes}>{children}</h1>;
        case "heading-two":
            return <h2 {...attributes}>{children}</h2>;
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
        default:
            return <p {...attributes}>{children}</p>;
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
