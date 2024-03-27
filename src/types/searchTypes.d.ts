export interface Recipe {
  id: string;
  title: string;
  timeRating: number;
  skillRating: number;
  userId: string;
}

export type SearchModalProps = {
  open: boolean;
  search: string;
  searchResults: Recipe[];
  loading: boolean;
  setOpen: (open: boolean) => void;
  handleResultClick: (id: string) => void;
  setSearch: (search: string) => void;
  handleSearch: (query: string) => void;
};
