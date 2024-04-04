import { useCallback, useMemo, useEffect } from 'react';
import { createEditor, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { Box, Divider } from '@mui/material';
import './styles.css';
import { EditorProps } from './editorTypes';
import ActionBar from './ActionBar';
import { handleKeyDown } from './helpers';

/**
 * Component for rendering a Slate editor.
 *
 * @param {EditorProps} props - The component props.
 * @param {any} props.recipeData - The recipe data.
 * @param {Function} props.setRecipeData - The function to set the recipe data.
 * @param {boolean} props.readOnly - Indicates if the editor is read-only.
 */
export default function RecipeEditor({ initRecipeData, setRecipeData }: EditorProps) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  // Logic for rendering every node according to its type
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  // Logic for rendering every leaf according to its type
  const renderLeaf = useCallback((props: any) => {
    return <Leaf {...props} />;
  }, []);

  useEffect(() => {
    // Delete every node in the editor
    editor.children.map(() => {
      Transforms.delete(editor, { at: [0] });
    });
    // Add the new content
    Transforms.insertNodes(editor, initRecipeData);
  }, [initRecipeData, editor]);

  return (
    <div className="editor">
      <Box sx={{ border: '2px solid', borderColor: 'primary.main' }}>
        <Slate editor={editor} initialValue={initRecipeData} onChange={value => setRecipeData?.(value)}>
          <ActionBar />
          <Divider />
          {/* Input box */}
          <Box width={'40vw'} sx={{ minInlineSize: '100%' }}>
            <Editable
              style={{ outline: 0, padding: 2, minHeight: '40vh' }}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={e => handleKeyDown(e, editor)}
            />
          </Box>
        </Slate>
      </Box>
    </div>
  );
}

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
