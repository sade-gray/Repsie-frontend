import React, { Dispatch, LazyExoticComponent, SetStateAction, useCallback, useState } from 'react';
import {
  BaseEditor,
  createEditor,
  Descendant,
  Editor,
  Transforms,
  Element as SlateElement,
} from 'slate';
import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react';
import { withHistory } from 'slate-history';
import { Box, Divider, Icon, IconButton } from '@mui/material';
import isHotkey from 'is-hotkey';
import '../styles.scss';

// Declare types for Slate
declare module 'slate' {
  export interface CustomTypes {
    Editor: CustomEditor;
    Text: CustomText;
    Element: CustomElement;
  }
}

// Declare types for the custom text
export type CustomText = {
  text: string;
  bold?: boolean | false;
  italic?: boolean | false;
  underline?: boolean | false;
  type: string;
  children: Descendant[];
};
// Declare types for the custom elements
export type CustomElement = {
  type: string;
  children: Descendant[];
};
// Declare types for the custom editor
interface CustomEditor extends BaseEditor, ReactEditor {
  type: string;
}
// Props for the Editor component
type EditorProps = {
  recipeData: Descendant[];
  setRecipeData?: Dispatch<SetStateAction<Descendant[]>>;
  readOnly?: boolean;
};

// List and text align types
const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

// Keybinds for the format hotkeys
const FORMAT_HOTKEYS: { [key: string]: string } = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
};
// Keybinds for the block hotkeys
const BLOCK_HOTKEYS: { [key: string]: string } = {
  'mod+1': 'heading-one',
  'mod+2': 'heading-two',
  'mod+e': 'center',
};

/**
 * Component for rendering a Slate editor.
 *
 * @param {EditorProps} props - The component props.
 * @param {any} props.recipeData - The recipe data.
 * @param {Function} props.setRecipeData - The function to set the recipe data.
 * @param {boolean} props.readOnly - Indicates if the editor is read-only.
 * @returns {JSX.Element} The rendered component.
 */
export default function SlateEditor({ recipeData, setRecipeData, readOnly }: EditorProps) {
  // Editor state
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  // This is the logic for rendering every node according to its type
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  // This is the logic for rendering every leaf according to its type
  const renderLeaf = useCallback((props: any) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <div className="editor">
      <Box
        // Set the border if the editor is not read-only
        sx={{
          border: !readOnly ? '2px solid' : 'none',
          borderColor: 'secondary.main',
        }}
      >
        <Slate
          editor={editor}
          initialValue={recipeData}
          // On change, set the recipe data if the editor is not read-only
          onChange={value => {
            !readOnly && setRecipeData?.(value);
          }}
        >
          {!readOnly && ( // If the editor is not read-only, render the buttons
            <div>
              <div className="editor--buttons">
                <MarkButton format="bold" icon="FormatBold" />
                <MarkButton format="italic" icon="FormatItalic" />
                <MarkButton format="underline" icon="FormatUnderlined" />
                <BlockButton format="heading-one" icon="LooksOne" />
                <BlockButton format="heading-two" icon="LooksTwo" />
                <BlockButton format="bulleted-list" icon="FormatListBulleted" />
                <BlockButton format="numbered-list" icon="FormatListNumbered" />
                <BlockButton format="left" type="align" icon="FormatAlignLeft" />
                <BlockButton format="center" type="align" icon="FormatAlignCenter" />
                <BlockButton format="right" type="align" icon="FormatAlignRight" />
                <BlockButton format="justify" type="align" icon="FormatAlignJustify" />
              </div>
              <Divider color="secondary" />
            </div>
          )}
          {/* Input box */}
          <Box
            sx={{
              width: '40vw',
              minInlineSize: '100%',
            }}
          >
            <Editable
              style={{
                outline: 0,
                padding: 2,
                minHeight: '40vh',
              }}
              readOnly={readOnly}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={event => {
                // Go through all the hotkeys and check if the event matches any of them
                for (const hotkey in FORMAT_HOTKEYS) {
                  // If the event matches a hotkey, prevent the default action and toggle the mark
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
                // Checks for the enter and backspace keys
                const { selection } = editor;

                // If the key is enter, check if the selection is a heading and if it is, insert a new line. Toggle heading mode off.
                if (event.key === 'Enter') {
                  if (selection) {
                    const [start] = Editor.nodes(editor, {
                      at: selection,
                      match: n =>
                        !Editor.isEditor(n) &&
                        SlateElement.isElement(n) &&
                        n.type.startsWith('heading'),
                    });

                    if (start) {
                      const [node, path] = start;
                      const [end] = Editor.nodes(editor, {
                        at: Editor.end(editor, selection),
                        match: n => n === node,
                      });

                      if (end) {
                        event.preventDefault();
                        const newLine = {
                          type: 'paragraph',
                          children: [{ text: '' }],
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

                // Check if the selection is at the start of the editor and if it is, exit the list
                if (
                  event.key === 'Backspace' &&
                  selection &&
                  Editor.start(editor, selection).offset === 0
                ) {
                  const [match] = Editor.nodes(editor, {
                    match: n => Editor.isBlock(editor, n) && n.type === 'list-item',
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
                        match: n => LIST_TYPES.includes(n.type),
                        split: true,
                      });
                      Transforms.setNodes(editor, { type: 'paragraph' });
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

/**
 * Toggles the block format of the editor.
 *
 * @param editor - The custom editor instance.
 * @param format - The format to toggle.
 */
const toggleBlock = (editor: CustomEditor, format: string) => {
  // Check if the block is active
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  );
  // Check if the format is a list
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    // Unwrap the nodes if the format is a list
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  // Set the properties of the nodes if the format is a text align type
  let properties = {};
  if (TEXT_ALIGN_TYPES.includes(format)) {
    properties = {
      align: isActive ? undefined : format,
    };
  } else {
    properties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    };
  }

  Transforms.setNodes(editor, properties);

  // Wrap the nodes if the format is a list
  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

/**
 * Toggles a mark in the editor. If the mark is already active, it removes it. If it is not active, it adds it.
 *
 * @param editor - The custom editor instance.
 * @param format - The format of the mark to toggle.
 */
const toggleMark = (editor: CustomEditor, format: string) => {
  const isActive = isMarkActive(editor, format);

  // If the mark is already active, remove it. If it is not, add it.
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

/**
 * Checks if a block is active in the editor.
 *
 * @param editor The custom editor instance.
 * @param format The format of the block to check.
 * @param blockType The type of the block to check (default: 'type').
 * @returns Returns true if the block is active, false otherwise.
 */
const isBlockActive = (editor: CustomEditor, format: string, blockType: string = 'type') => {
  // Get the selection of the editor
  const { selection } = editor;
  // If there is no selection, return false
  if (!selection) return false;

  // Check if the block is active by checking if the selection matches the block type
  const [match] = Array.from(
    Editor.nodes<SlateElement>(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as { [key: string]: any })[blockType] === format,
    })
  );

  // Return true if the block is active, false otherwise
  return !!match;
};

/**
 * Checks if a specific mark format is active in the editor.
 *
 * @param editor - The custom editor instance.
 * @param format - The mark format to check.
 * @returns True if the mark format is active, false otherwise.
 */
const isMarkActive = (editor: CustomEditor, format: string) => {
  const marks: any = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

// Lazy load the icons to reduce the initial bundle size
const Icons: { [key: string]: LazyExoticComponent<React.ComponentType<any>> } = {
  FormatBold: React.lazy(() => import('@mui/icons-material/FormatBold')),
  FormatItalic: React.lazy(() => import('@mui/icons-material/FormatItalic')),
  FormatUnderlined: React.lazy(() => import('@mui/icons-material/FormatUnderlined')),
  LooksOne: React.lazy(() => import('@mui/icons-material/LooksOne')),
  LooksTwo: React.lazy(() => import('@mui/icons-material/LooksTwo')),
  FormatListBulleted: React.lazy(() => import('@mui/icons-material/FormatListBulleted')),
  FormatListNumbered: React.lazy(() => import('@mui/icons-material/FormatListNumbered')),
  FormatAlignLeft: React.lazy(() => import('@mui/icons-material/FormatAlignLeft')),
  FormatAlignCenter: React.lazy(() => import('@mui/icons-material/FormatAlignCenter')),
  FormatAlignRight: React.lazy(() => import('@mui/icons-material/FormatAlignRight')),
  FormatAlignJustify: React.lazy(() => import('@mui/icons-material/FormatAlignJustify')),
};

// Props for the button components
type ButtonProps = {
  icon: keyof typeof Icons;
  format: string;
  type?: string;
};

// Dynamic icon props
type DynamicIconProps = {
  name: string;
};

/**
 * Renders a dynamic icon based on the provided name.
 *
 * @param {DynamicIconProps} props - The props for the DynamicIcon component.
 * @param {string} props.name - The name of the icon to render.
 * @returns {JSX.Element} The rendered dynamic icon.
 */
const DynamicIcon = ({ name }: DynamicIconProps): JSX.Element => {
  const IconComponent = Icons[name];
  return (
    <React.Suspense fallback={<div />}>
      <IconComponent />
    </React.Suspense>
  );
};

/**
 * Renders a button for marking text in the editor.
 *
 * @param {ButtonProps} props - The button props.
 * @returns {JSX.Element} The rendered button component.
 */
const MarkButton = ({ icon, format }: ButtonProps) => {
  const editor = useSlate();
  return (
    <IconButton
      onMouseDown={event => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon color={isMarkActive(editor, format) ? 'secondary' : 'disabled'}>
        <DynamicIcon name={icon as string} />
      </Icon>
    </IconButton>
  );
};

/**
 * Renders a block button component.
 *
 * @param icon - The icon to be displayed.
 * @param format - The format of the block.
 * @param type - The type of the block.
 */
const BlockButton = ({ icon, format, type }: ButtonProps) => {
  const editor = useSlate();
  return (
    <IconButton
      onMouseDown={event => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon color={isBlockActive(editor, format, type) ? 'secondary' : 'disabled'}>
        <DynamicIcon name={icon as string} />
      </Icon>
    </IconButton>
  );
};
/**
 * Renders an element based on its type.
 *
 * @param attributes - The attributes to be applied to the element.
 * @param children - The children elements of the element.
 * @param element - The element object containing the type and align properties.
 * @returns The rendered element based on its type.
 */
const Element = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case 'bulleted-list':
      return (
        <ul className="bulleted--list" {...attributes}>
          {children}
        </ul>
      );
    case 'numbered-list':
      return (
        <ol className="numbered--list" {...attributes}>
          {children}
        </ol>
      );
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

/**
 * Renders a leaf node in the editor.
 * @param {Object} attributes - The attributes for the leaf node.
 * @param {ReactNode} children - The children of the leaf node.
 * @param {Object} leaf - The properties of the leaf node.
 * @returns {ReactNode} The rendered leaf node.
 */
const Leaf = ({ attributes, children, leaf }: any) => {
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
