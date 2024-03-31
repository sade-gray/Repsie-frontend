import { searchRecipes } from '@api/search';
import { Search } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { Recipe } from 'types/searchTypes';
import { useNavigate } from 'react-router-dom';
import SearchModal from './SearchModal';

export function HeaderSearch() {
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
    <Box display={'flex'} alignContent={'center'} flexDirection={'column'}>
      {/* Search icon */}
      <Tooltip title="Search for recipes">
        <IconButton onClick={handleToggle} color="secondary" size="medium">
          <Search />
        </IconButton>
      </Tooltip>
      {/* Search modal */}
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
