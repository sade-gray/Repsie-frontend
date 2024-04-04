import { BaseEditor, Descendant } from ' slate';
import { ReactEditor } from 'slate-react';

// Declare types for Slate
declare module 'slate' {
  export interface CustomTypes {
    Editor: CustomEditor;
    Text: CustomText;
    Element: CustomElement;
  }
}

// Types for the custom text
export type CustomText = {
  text: string;
  bold?: boolean | false;
  italic?: boolean | false;
  underline?: boolean | false;
  type: string;
  children: Descendant[];
};

// Types for the custom elements
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
  initRecipeData: Descendant[];
  recipeData?: Descendant[];
  setRecipeData?: Dispatch<SetStateAction<Descendant[]>>;
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
