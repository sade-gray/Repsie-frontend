import { createEditor } from 'slate';
import { Editable, Slate } from 'slate-react';
import { Leaf } from '@component/RecipeEditor/Leaf';
import { Element } from '@component/RecipeEditor/Element';
import { useCallback } from 'react';
import { EditorProps } from '@component/RecipeEditor/editorTypes';

export default function RecipeViewer({ initRecipeData }: EditorProps) {
  const editor = createEditor();
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  // Logic for rendering every leaf according to its type
  const renderLeaf = useCallback((props: any) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <Slate editor={editor} initialValue={initRecipeData}>
      <Editable renderElement={renderElement} renderLeaf={renderLeaf} readOnly />
    </Slate>
  );
}
