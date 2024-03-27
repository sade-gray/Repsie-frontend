import { Avatar, Grid, Typography } from '@mui/material';

interface PublisherProps {
  // ? is used to denote an optional prop
  outline?: 'bold';
  size?: 'x-small' | 'small' | 'medium' | 'large' | '';
  publisherName: string;
  publisherImageUrl?: string;
  color?: string | '';
}

export function PublisherContainer(props: PublisherProps) {
  const size = () => {
    switch (props.size) {
      case 'x-small':
        return '25px';
      case 'small':
        return '30px';
      case 'medium':
        return '40px';
      case 'large':
        return '60px';
      default:
        return '35px';
    }
  };
  const fontSize = () => {
    switch (props.size) {
      case 'x-small':
        return 'x-small';
      case 'small':
        return 'small';
      case 'medium':
        return 'medium';
      default:
        return 'medium';
    }
  };

  return (
    <Grid container alignItems={'center'} fontSize={props.size} my={0.5}>
      <Avatar alt="Avatar" sx={{ width: size(), height: size(), mx: 1 }} />
      <Typography variant="body2" color={'primary.dark'} fontSize={fontSize()}>
        {props.publisherName}
      </Typography>
    </Grid>
  );
}
