import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

import '../../style/App.scss';
import './user-form.scss';
import { loginPageLink } from '../../constants/link.constants';
import UserFormInput from './UserFormInput';
import { userActions } from '../../actions/user.actions';
import UserSelect from './UserSelect';

const SignUpForm = () => {
  const intl = useIntl();

  const genders = [
    { value: 'male', label: 'MALE' },
    { value: 'female', label: 'FEMALE' },
    { value: 'not_specified', label: 'NOT SPECIFIED' },
  ];

  const { select_gender } = {};

  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    password1: '',
    password2: '',
    gender: '',
  });
  const { name, email, password1, password2, gender } = inputs;

  const [isSubmitted, setIsSubmitted] = useState(false);

  const dispatch = useDispatch();

  const alert = useSelector((state) => state.alert);

  const [cleanAlert, setCleanAlert] = useState(false);

  const userRequest = useSelector((state) => state.authentication.userRequest);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
    setCleanAlert(true);
  };

  const handleChangeGender = (select_gender) => {
    setCleanAlert(true);
    setInputs((inputs) => ({ ...inputs, gender: select_gender['value'] }));
  };

  const missingFields = !name || !email || !password1 || !password2 || !gender;

  const equalPasswords = password1 === password2;

  const showSignupAlert = isSubmitted && !userRequest && !cleanAlert && alert;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setCleanAlert(false);
    if (!missingFields && equalPasswords) {
      setCleanAlert(false);
      dispatch(userActions.signup(name, email, password1, password2, gender));
    }
  };

  return (
    <form align="center" className="user-form" onSubmit={handleSubmit}>
      <UserFormInput
        inputLabel={intl.formatMessage({
          id: 'userform.name.label.text',
        })}
        inputType="text"
        inputName="name"
        inputValue={name}
        inputOnChange={handleChange}
        error={isSubmitted && !name}
        errorMsg={intl.formatMessage({
          id: 'userform.missing.name.text',
        })}
      />
      <UserFormInput
        inputLabel={intl.formatMessage({
          id: 'userform.email.label.text',
        })}
        inputType="email"
        inputName="email"
        inputValue={email}
        inputOnChange={handleChange}
        error={isSubmitted && !email}
        errorMsg={intl.formatMessage({
          id: 'userform.missing.email.text',
        })}
      />
      <UserFormInput
        inputLabel={intl.formatMessage({
          id: 'userform.password.label.text',
        })}
        inputType="password"
        inputName="password1"
        inputValue={password1}
        inputOnChange={handleChange}
        inputPlaceHolder={intl.formatMessage({
          id: 'userform.pass.placeholder.text',
        })}
        error={isSubmitted && !password1}
        errorMsg={intl.formatMessage({
          id: 'userform.missing.pass.text',
        })}
      />
      <UserFormInput
        inputLabel={intl.formatMessage({
          id: 'userform.confirmpass.label.text',
        })}
        inputType="password"
        inputName="password2"
        inputValue={password2}
        inputOnChange={handleChange}
        error={isSubmitted && !password2}
        errorMsg={intl.formatMessage({
          id: 'userform.missing.pass2.text',
        })}
      />
      <div>
        {isSubmitted && password1 && password2 && !equalPasswords && (
          <div className="user-form__alert">
            {intl.formatMessage({
              id: 'userform.not.matching.passwords.text',
            })}
          </div>
        )}
      </div>
      <p className="user-form__text">GENDER</p>
      <UserSelect
        optionsSet={genders}
        onChangeFunction={handleChangeGender}
        placeHolder={intl.formatMessage({
          id: 'userform.select.gender.text',
        })}
        valueSelect={select_gender}
        error={isSubmitted && !gender}
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
      {showSignupAlert && (
        <div className="user-form__alert"> {alert.message} </div>
      )}
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

export default SignUpForm;
