import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material';
import fullLogo from '../../assets/logo.svg';
import shortLogo from '/favicon.svg';
import { useNavigate } from 'react-router-dom';

export default function RepsieLogo() {
  const theme = useTheme();
  const navigate = useNavigate();
  return <img onClick={() => navigate('/')} src={useMediaQuery(theme.breakpoints.up('md')) ? fullLogo : shortLogo} alt={'Repsie logo'} />;
}
