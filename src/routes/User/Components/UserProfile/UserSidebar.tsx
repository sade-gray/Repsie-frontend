import { Link } from 'react-router-dom';
import './UserSidebar.css';
import DescriptionIcon from '@mui/icons-material/Description';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PasswordIcon from '@mui/icons-material/Password';

const UserSidebar = ({ activepage }: { activepage: string }) => {
  return (
    <div className="usersidebar">
      {activepage === 'accountsettings' ? (
        <div className="s2">
          <span>Account Settings</span>
        </div>
      ) : (
        <Link to="/UserProfile/accountsettings" className="stylenone">
          <div className="s1">
            <ManageAccountsIcon />
            <span>Account Settings</span>
          </div>
        </Link>
      )}

      {activepage === 'changepassword' ? (
        <div className="s2">
          <span>Change Password</span>
        </div>
      ) : (
        <Link to="/UserProfile/changepassword" className="stylenone">
          <div className="s1">
            <PasswordIcon />

            <span>Change Password</span>
          </div>
        </Link>
      )}

      {activepage === 'legalnotice' ? (
        <div className="s2">
          <span>Legal Notice</span>
        </div>
      ) : (
        <Link to="/UserProfile/legalnotice" className="stylenone">
          <div className="s1">
            <DescriptionIcon />
            <span>Legal Notice</span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default UserSidebar;
