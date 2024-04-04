import { useCallback, useMemo, useEffect } from 'react';
import { createEditor, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { Box, Divider } from '@mui/material';
import './styles.css';
import { EditorProps } from './editorTypes';
import ActionBar from './ActionBar';
import { handleKeyDown } from './helpers';
import { Leaf } from './Leaf';
import { Element } from './Element';
/**
 * Component for editing a recipe
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
