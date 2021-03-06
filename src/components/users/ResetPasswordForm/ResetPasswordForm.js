import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { string } from 'prop-types';
import { useIntl } from 'react-intl';
import { isEmpty, omit } from 'lodash';
import { validate } from 'validate.js';

import 'style/App.scss';
import 'style/user-form.scss';
import { userActions } from 'actions/userActions';
import FormInput from 'components/common/FormInput/FormInput';
import { userRequest } from 'actions/userActions';
import CustomLoader from 'components/common/CustomLoader/CustomLoader';
import {
  userActionTypesConstants,
  userFormNames,
} from 'constants/userConstants';
import { changePasswordConstraints } from 'helpers/usersConstraints';
import useResetPassword from 'hooks/useResetPassword';

const ResetPasswordForm = ({ urlUid, urlToken }) => {
  const intl = useIntl();

  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({
    password: '',
    passwordConfirm: '',
  });
  const { password, passwordConfirm } = inputs;

  const [errors, setErrors] = useState({});

  const { USER_CLEAN_ALERT } = userActionTypesConstants;

  const { PASSWORD, PASSWORD_CONFIRM } = userFormNames;

  const { loading, requestError, errorMsg } = useResetPassword(setErrors);

  const handleChange = ({ target: { name, value } }) => {
    if (requestError) {
      dispatch({ type: USER_CLEAN_ALERT });
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
        inputName={PASSWORD}
        inputValue={password}
        inputOnChange={handleChange}
        error={PASSWORD in errors}
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
        inputName={PASSWORD_CONFIRM}
        inputValue={passwordConfirm}
        inputOnChange={handleChange}
        error={
          PASSWORD_CONFIRM in errors &&
          errors.passwordConfirm[0].includes('restricted')
        }
        errorMsg={intl.formatMessage({
          id: 'userform.missing.pass2.text',
        })}
      />
      <div>
        {PASSWORD_CONFIRM in errors &&
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
