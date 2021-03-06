import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { isEmpty, omit } from 'lodash';
import { validate } from 'validate.js';
import { func } from 'prop-types';

import 'style/App.scss';
import 'style/user-form.scss';
import { loginPageLink } from 'constants/linkConstants';
import { userActions } from 'actions/userActions';
import FormInput from 'components/common/FormInput/FormInput';
import FormSelect from 'components/common/FormSelect/FormSelect';
import { genderSelectStyle } from 'utils/genderSelectStyle';
import { userRequest } from 'actions/userActions';
import { genders } from 'utils/gendersList';
import {
  userActionTypesConstants,
  userFormNames,
} from 'constants/userConstants';
import { signupConstraints } from 'helpers/usersConstraints';
import CustomLoader from 'components/common/CustomLoader/CustomLoader';
import useSignUp from 'hooks/useSignUp';

const SignUpForm = ({ setSignupSuccess }) => {
  const intl = useIntl();

  const { selectGender } = {};

  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    gender: '',
  });
  const { name, email, password, passwordConfirm, gender } = inputs;

  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});

  const { NAME, EMAIL, PASSWORD, PASSWORD_CONFIRM, GENDER } = userFormNames;

  const { USER_CLEAN_ALERT } = userActionTypesConstants;

  const { requestError, errorMsg, loading } = useSignUp(
    setErrors,
    setSignupSuccess
  );

  const handleChange = ({ target: { name, value } }) => {
    if (requestError) {
      dispatch({ type: USER_CLEAN_ALERT });
    }
    setErrors(omit(errors, name)); // Return same object with deleted field
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const handleChangeGender = (selectGender) => {
    if (requestError) {
      dispatch({ type: USER_CLEAN_ALERT });
    }
    setErrors(omit(errors, GENDER));
    setInputs((inputs) => ({ ...inputs, gender: selectGender['value'] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentErrors = validate(inputs, signupConstraints) || {}; // Set empty errors if validate returns undefined
    if (isEmpty(currentErrors)) {
      dispatch(userRequest());
      dispatch(
        userActions.signup(name, email, password, passwordConfirm, gender)
      );
    }
    setErrors(currentErrors);
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <FormInput
        labelClassName="user-form__text"
        inputClassName="user-form__input"
        inputLabel={intl.formatMessage({
          id: 'userform.name.label.text',
        })}
        inputType="text"
        inputName={NAME}
        inputValue={name}
        inputOnChange={handleChange}
        error={NAME in errors}
        errorMsg={intl.formatMessage({
          id: 'userform.missing.name.text',
        })}
      />
      <FormInput
        labelClassName="user-form__text"
        inputClassName="user-form__input"
        inputLabel={intl.formatMessage({
          id: 'userform.email.label.text',
        })}
        inputType="email"
        inputName={EMAIL}
        inputValue={email}
        inputOnChange={handleChange}
        error={EMAIL in errors}
        errorMsg={intl.formatMessage({
          id: 'userform.missing.email.text',
        })}
      />
      <FormInput
        labelClassName="user-form__text"
        inputClassName="user-form__input"
        inputLabel={intl.formatMessage({
          id: 'userform.password.label.text',
        })}
        inputType="password"
        inputName={PASSWORD}
        inputValue={password}
        inputOnChange={handleChange}
        inputPlaceHolder={intl.formatMessage({
          id: 'userform.pass.placeholder.text',
        })}
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
      <p className="user-form__text">
        {intl.formatMessage({
          id: 'userform.gender.label.text',
        })}
      </p>
      <FormSelect
        customStyle={genderSelectStyle}
        customClassName="user-form__text user-form__select"
        optionsSet={genders}
        onChangeFunction={handleChangeGender}
        placeHolder={intl.formatMessage({
          id: 'userform.select.gender.text',
        })}
        valueSelect={selectGender}
        error={GENDER in errors}
        errorMsg={intl.formatMessage({
          id: 'userform.missing.gender.text',
        })}
      />
      <div>
        <button type="submit" className="user-form__btn-text">
          {intl.formatMessage({
            id: 'userform.signup.text',
          })}
        </button>
      </div>
      {loading && <CustomLoader />}
      {requestError && <div className="user-form__alert"> {errorMsg} </div>}
      <hr className="user-form__hr" />
      <div className="user-form__text">
        <Link to={loginPageLink}>
          {intl.formatMessage({
            id: 'userform.signin.text',
          })}
        </Link>
      </div>
    </form>
  );
};

SignUpForm.propTypes = {
  setSignupSuccess: func,
};

export default SignUpForm;
