import './styles.css';

/**
 * Renders an element based on its type.
 *
 * @param attributes - The attributes to be applied to the element.
 * @param children - The children elements of the element.
 * @param element - The element object containing the type and align properties.
 * @returns The rendered element based on its type.
 */
export const Element = ({ attributes, children, element }: any) => {
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
