import { Box, Button, Stack, Typography } from '@mui/material';
import img from '../../assets/404/pizza-404.png';
import { ArrowBack } from '@mui/icons-material';

export default function RouteNotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <Stack
        direction={'row'}
        sx={{
          marginBottom: '2rem',
        }}
      >
        <Stack direction={'column'} alignItems={'center'}>
          <Typography variant="h3" color={'secondary'}>
            Page Not Found
          </Typography>
          <Typography variant="h6">The page you are looking for does not exist.</Typography>
        </Stack>
        <img src={img} alt="logo" width={200} height={200} />
      </Stack>

      <Button variant="contained" color="secondary" href="/">
        <ArrowBack />
        Go Home
      </Button>
    </Box>
  );
}
