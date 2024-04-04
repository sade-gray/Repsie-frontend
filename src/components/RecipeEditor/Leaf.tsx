import './styles.css';

/**
 * Renders a leaf node in the editor.
 * @param {Object} attributes - The attributes for the leaf node.
 * @param {ReactNode} children - The children of the leaf node.
 * @param {Object} leaf - The properties of the leaf node.
 * @returns {ReactNode} The rendered leaf node.
 */
export const Leaf = ({ attributes, children, leaf }: any) => {
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
