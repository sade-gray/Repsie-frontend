import { CustomEditor, CustomElement } from './editorTypes';
import { Editor, Element as SlateElement, Transforms } from 'slate';
import isHotkey from 'is-hotkey';

export const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, editor: CustomEditor) => {
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
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type.startsWith('heading'),
      });

      if (start) {
        const [node, path] = start;
        const [end] = Editor.nodes(editor, {
          at: Editor.end(editor, selection),
          match: n => n === node,
        });

        if (end) {
          event.preventDefault();
          const newLine: CustomElement = {
            type: 'paragraph',
            children: [{ text: '' }],
          };

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
  if (event.key === 'Backspace' && selection && Editor.start(editor, selection).offset === 0) {
    const [match] = Editor.nodes(editor, {
      match: n => Editor.isBlock(editor, n) && n.type === 'list-item',
    });

    if (match) {
      const [, path] = match;
      const listItemPath = path.slice(0, path.length - 1); // Remove last index to get the list item
      const listNode = Editor.node(editor, listItemPath);

      if (listNode && SlateElement.isElement(listNode[0]) && listNode[0].children.length === 1) {
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
};

export const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];
const LIST_TYPES = ['numbered-list', 'bulleted-list'];

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
 * Toggles a mark in the editor. If the mark is already active, it removes it. If it is not active, it adds it.
 *
 * @param editor - The custom editor instance.
 * @param format - The format of the mark to toggle.
 */
export const toggleMark = (editor: CustomEditor, format: string) => {
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
export const isBlockActive = (editor: CustomEditor, format: string, blockType: string = 'type') => {
  // Get the selection of the editor
  const { selection } = editor;
  // If there is no selection, return false
  if (!selection) return false;

  // Check if the block is active by checking if the selection matches the block type
  const [match] = Array.from(
    Editor.nodes<SlateElement>(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && (n as { [key: string]: any })[blockType] === format,
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
export const isMarkActive = (editor: CustomEditor, format: string) => {
  const marks: any = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

/**
 * Toggles the block format of the editor.
 *
 * @param editor - The custom editor instance.
 * @param format - The format to toggle.
 */
export const toggleBlock = (editor: CustomEditor, format: string) => {
  // Check if the block is active
  const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type');
  // Check if the format is a list
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    // Unwrap the nodes if the format is a list
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && LIST_TYPES.includes(n.type) && !TEXT_ALIGN_TYPES.includes(format),
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
