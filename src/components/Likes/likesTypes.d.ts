export interface LikesProps {
  totalLikes: number;
  readOnly?: boolean;
  /** Whether it is liked by the user or not */
  liked?: boolean;
  /** Function that must return a boolean, so the component can handle toggling on errors */
  onClick?: () => Promise<boolean>;
}
