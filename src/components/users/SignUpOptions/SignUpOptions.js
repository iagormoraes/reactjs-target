import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';

import 'components/users/SignUpOptions/sign-up-options.scss';
import { signupPageLink, loginPageLink } from 'constants/linkConstants';

const SignUpOptions = () => {
  const intl = useIntl();

  return (
    <div className="signup-options">
      <div className="signup-options__facebook">
        <a href={loginPageLink}>
          {intl.formatMessage({
            id: 'userform.connectfb.text',
          })}
        </a>
        <hr className="signup-options__hr" />
      </div>
      <div className="signup-options__sign-up">
        <Link to={signupPageLink}>
          {intl.formatMessage({
            id: 'userform.signup.text',
          })}
        </Link>
      </div>
    </div>
  );
};

export default SignUpOptions;
