// import BookmarkIn from "../assets/Bookmark-in.svg"
import BookmarkOut from '../assets/Bookmark-out.svg';
import { useState } from 'react';

export default function SavedRecipeDrawerIcon() {
  const [open, setOpen] = useState(true);

  const handleOpenToggle = () => {
    setOpen(!open);
  };

  return (
    // TODO: Add some animations to these icons
    <div className={'saved--recipe--drawer--icon--container'} onClick={() => handleOpenToggle()}>
      <img className={'saved--recipe--drawer--icon'} src={BookmarkOut} />
    </div>
  );
}
