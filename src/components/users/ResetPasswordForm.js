import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { string } from 'prop-types';
import { useIntl } from 'react-intl';
import { isEmpty, omit } from 'lodash';
import { validate } from 'validate.js';

import 'style/App.scss';
import 'components/users/user-form.scss';
import { userActions } from 'actions/user.actions';
import FormInput from 'components/common/FormInput';
import { userRequest } from 'actions/user.actions';
import CustomLoader from 'components/common/CustomLoader';
import { userConstants, userFormNames } from 'constants/user.constants';
import { changePasswordConstraints } from 'helpers/users-constraints';

const ResetPasswordForm = ({ urlUid, urlToken }) => {
  const intl = useIntl();

  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({
    password: '',
    passwordConfirm: '',
  });
  const { password, passwordConfirm } = inputs;

  const [errors, setErrors] = useState({});

  const { loading, requestError, errorMsg, updated } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (updated) {
      setErrors({});
      alert(
        intl.formatMessage({
          id: 'reset.password.completed.text',
        })
      );
    }
  }, [updated, intl, setErrors]);

  const handleChange = ({ target: { name, value } }) => {
    if (requestError) {
      dispatch({ type: userConstants.USER_CLEAN_ALERT });
    }
    setErrors(omit(errors, name));
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentErrors = validate(inputs, changePasswordConstraints) || {};
    if (isEmpty(currentErrors)) {
      dispatch(userRequest());
      dispatch(
        userActions.resetPasswordConfirm(
          password,
          passwordConfirm,
          urlUid,
          urlToken
        )
      );
    }
    setErrors(currentErrors);
  };

  return (
    <form className="user-form reset-password-form" onSubmit={handleSubmit}>
      <FormInput
        labelClassName="user-form__text"
        inputClassName="user-form__input"
        inputLabel={intl.formatMessage({
          id: 'new.password.label.text',
        })}
        inputType="password"
        inputName={userFormNames.password}
        inputValue={password}
        inputOnChange={handleChange}
        error={userFormNames.password in errors}
        errorMsg={intl.formatMessage({
          id: 'userform.missing.pass.text',
        })}
      />
      <FormInput
        labelClassName="user-form__text"
        inputClassName="user-form__input"
        inputLabel={intl.formatMessage({
          id: 'userform.confirmpass.label.text',
        })}
        inputType="password"
        inputName={userFormNames.passwordConfirm}
        inputValue={passwordConfirm}
        inputOnChange={handleChange}
        error={
          userFormNames.passwordConfirm in errors &&
          errors.passwordConfirm[0].includes('restricted')
        }
        errorMsg={intl.formatMessage({
          id: 'userform.missing.pass2.text',
        })}
      />
      <div>
        {userFormNames.passwordConfirm in errors &&
          errors.passwordConfirm[0].includes('not equal') && (
            <div className="user-form__alert">
              {intl.formatMessage({
                id: 'userform.not.matching.passwords.text',
              })}
            </div>
          )}
      </div>
      {loading && <CustomLoader />}
      {requestError && <div className="user-form__alert"> {errorMsg} </div>}
      <div>
        <button type="submit" className="user-form__btn-text">
          {intl.formatMessage({
            id: 'reset.password.btn.text',
          })}
        </button>
      </div>
    </form>
  );
};

ResetPasswordForm.propTypes = {
  urlUid: string,
  urlToken: string,
};

export default ResetPasswordForm;
