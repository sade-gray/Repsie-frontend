import './AccountSettings.css';
import SaveIcon from '@mui/icons-material/Save';

const AccountSettings = () => {
  return (
    <div className="accountsettings">
      <h1 className="mainhead1">Personal Information</h1>

      <div className="form">
        <div className="form-group">
          <label htmlFor="name">
            Your Name <span>*</span>
          </label>
          <input type="text" name="name" id="name" />
        </div>

        <div className="form-group">
          <label htmlFor="phone">
            Phone/Mobile <span>*</span>
          </label>
          <input type="text" name="phone" id="phone" />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span>*</span>
          </label>
          <input type="email" name="email" id="email" />
        </div>
      </div>

      <button className="mainhead1">
        <SaveIcon />
      </button>
    </div>
  );
};

export default AccountSettings;
