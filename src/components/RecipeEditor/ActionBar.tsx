import { Box, Icon, IconButton } from '@mui/material';
import React, { LazyExoticComponent } from 'react';
import { ButtonProps, DynamicIconProps } from './editorTypes';
import { useSlate } from 'slate-react';
import { toggleMark, isMarkActive, isBlockActive, toggleBlock } from './helpers';

export default function ActionBar() {
  return (
    <Box display={'flex'} justifyContent={'flex-start'} flexWrap={'wrap'} color={'primary'}>
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
    </Box>
  );
}

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
      <Icon color={isMarkActive(editor, format) ? 'primary' : 'disabled'}>
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
      <Icon color={isBlockActive(editor, format, type) ? 'primary' : 'disabled'}>
        <DynamicIcon name={icon as string} />
      </Icon>
    </IconButton>
  );
};
