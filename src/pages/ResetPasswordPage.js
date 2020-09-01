import React from 'react';
import { useIntl } from 'react-intl';

import '../style/App.scss';
import AppStoreContainer from '../components/app-store-container/AppStoreContainer';
import ResetPasswordForm from '../components/users/ResetPasswordForm';
import smilies from '../assets/smilies.png';

const ResetPasswordPage = () => {
  const [uid, token] = [
    window.location.href.split('/')[4],
    window.location.href.split('/')[5],
  ];

  const intl = useIntl();

  return (
    <div className="main-div">
      <div className="login-page-container" align="center">
        <div className="login-page-container__reset-password-smilies">
          <img src={smilies} alt="smilies" />
        </div>
        <p className="login-page-container__app-title">TARGET MVD</p>
        <p className="login-page-container__description-text">
          {intl.formatMessage({
            id: 'enter.new.password.text',
          })}
        </p>
        <ResetPasswordForm intl={intl} url_uid={uid} url_token={token} />
      </div>
      <AppStoreContainer />
    </div>
  );
};

export default ResetPasswordPage;