import escapeHtml from "escape-html";
import {Node, Text} from "slate";

export const serialize = (node: Node): string => {
    if (Text.isText(node)) {
        let string = escapeHtml(node.text);
        if (node.bold) {
            string = `<strong>${string}</strong>`;
        }
        if (node.italic) {
            string = `<em>${string}</em>`;
        }
        if (node.underline) {
            string = `<u>${string}</u>`;
        }
        return string;
    }

    const children = node.children?.map((n) => serialize(n)).join("");

    switch (node.type) {
        case "heading-one":
            return `<h1>${children}</h1>`;
        case "heading-two":
            return `<h2>${children}</h2>`;
        case "paragraph":
            return `<p>${children}</p>`;
        case "bulleted-list":
            return `<ul className='bulleted--list'>${children}</ul>`;
        case "numbered-list":
            return `<ol className='numbered--list'>${children}</ol>`;
        case "list-item":
            return `<li>${children}</li>`;
        default:
            return children;
    }
};
