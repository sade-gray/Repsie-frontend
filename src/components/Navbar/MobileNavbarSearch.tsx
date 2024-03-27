import { Search } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import SearchModal from './SearchModal';
import { searchRecipes } from '@api/search';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recipe } from 'types/searchTypes';

export function MobileNavbarSearch() {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (query: string) => {
    setLoading(true);

    if (!query) {
      setLoading(false);
      return;
    }

    const results = await searchRecipes(query);
    if (!results) return;

    if (results.length === 0) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setSearchResults(results as unknown as Recipe[]);
    setLoading(false);
  };

  const handleResultClick = (id: string) => {
    navigate(`recipe/${id}`);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Box>
      {/* Search icon */}
      <IconButton color="inherit" onClick={handleToggle}>
        <Search fontSize={'large'} />
      </IconButton>
      {/* Mobile Search Modal */}
      <SearchModal
        open={open}
        setOpen={setOpen}
        search={search}
        setSearch={setSearch}
        searchResults={searchResults}
        handleSearch={handleSearch}
        handleResultClick={handleResultClick}
        loading={loading}
      />
    </Box>
  );
}
