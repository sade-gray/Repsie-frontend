import SkillRating from '@component/Ratings/SkillRating';
import TimeRating from '@component/Ratings/TimeRating';
import { Search } from '@mui/icons-material';
import { Box, Modal, TextField, Button, CircularProgress, Typography, useMediaQuery, useTheme } from '@mui/material';
import { SearchModalProps } from 'types/searchTypes';

function SearchModal({ open, setOpen, search, setSearch, searchResults, handleSearch, handleResultClick, loading }: SearchModalProps) {
  const theme = useTheme();
  const isNotTablet = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <Box>
      {/* Search modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isNotTablet ? 400 : 300,
            minHeight: 400,
            maxHeight: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            overflowY: 'auto',
          }}
        >
          <Box display={'flex'} flexDirection={'row'} sx={{ borderRadius: 2, gap: 1 }} mb={2}>
            {/* Search box */}
            <TextField
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={'Search for recipes'}
              variant={'outlined'}
              size={'small'}
              fullWidth
              onSubmit={() => handleSearch(search)}
              sx={{
                borderRadius: 4,
                '& .MuiOutlinedInput-root': {
                  '& > fieldset': {
                    border: 'solid 2px',
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiOutlinedInput-root:hover': {
                  '& > fieldset': { borderColor: 'primary' },
                },
              }}
            ></TextField>
            {/* Search button */}
            <Button onClick={() => handleSearch(search)} color="primary" size="medium" variant="contained">
              {loading ? <CircularProgress size={20} /> : <Search />}
            </Button>
          </Box>
          {/* Search results */}
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            {searchResults.map(result => (
              <Box
                key={result.id}
                onClick={() => handleResultClick(result.id)}
                sx={{
                  ':hover': {
                    cursor: 'pointer',
                  },
                  bgcolor: 'secondary.dark',
                  borderRadius: 2,
                  p: 1,
                  color: 'primary.main',
                }}
              >
                {/* Result content */}
                <Box display={'flex'} flexDirection={'column'} gap={1}>
                  <Typography color="black">{result.title}</Typography>
                  {/* Ratings */}
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <SkillRating value={result.skillRating} size={'medium'} readOnly />
                    <TimeRating value={result.timeRating} size={'medium'} readOnly />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default SearchModal;
