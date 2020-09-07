import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NumberFormat from 'react-number-format';
import { func, string } from 'prop-types';
import { useIntl } from 'react-intl';

import 'components/targets/create-target-form.scss';
import FormInput from 'components/common/FormInput';
import FormSelect from 'components/common/FormSelect';
import { topicSelectStyle } from 'components/targets/topicSelectStyle';
import {
  CustomSelectOption,
  CustomSelectValue,
} from 'components/common/customIconOption';
import { topics } from 'components/targets/topicsList';
import { targetActions } from 'actions/target.actions';
import { targetConstants } from 'constants/target.constants';
import { userRequest } from 'actions/user.actions';
import { latLngShape } from 'constants/shapes';
import CustomLoader from 'components/common/CustomLoader';

const CreateTargetForm = ({
  newTargetlatlng,
  setNewTargetlatlng,
  newTargetRadius,
  setNewTargetRadius,
}) => {
  const intl = useIntl();

  const { select_topic } = {};

  const [isSubmitted, setIsSubmitted] = useState(false);

  const createTargetState = useSelector((state) => state.target);

  const createTargetError = useSelector((state) => state.user.errorMsg);
  const createTargetRequest = useSelector((state) => state.user.loading);

  const [inputs, setInputs] = useState({
    radius: newTargetRadius,
    title: '',
    topic: '',
  });
  const { radius, title, topic } = inputs;

  const [cleanAlert, setCleanAlert] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (createTargetState.createTargetSuccess) {
      alert(
        intl.formatMessage({
          id: 'createtarget.success.text',
        })
      );
      setNewTargetlatlng(null);
      setNewTargetRadius('');
      dispatch({ type: targetConstants.CREATE_ALERT_FINISHED });
    }
  }, [
    createTargetState,
    setNewTargetRadius,
    setNewTargetlatlng,
    intl,
    dispatch,
  ]);

  const showCreateTargetAlert = isSubmitted && createTargetError && !cleanAlert;

  const handleChange = ({ target: { name, value } }) => {
    setCleanAlert(true);
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const handleChangeTopic = (select_topic) => {
    setCleanAlert(true);
    setInputs((inputs) => ({ ...inputs, topic: select_topic['value'] }));
  };

  const handleChangeRadius = (e) => {
    setInputs((inputs) => ({ ...inputs, radius: e.value }));
    setNewTargetRadius(e.value);
  };

  const noMissingValues = radius && title && topic && newTargetlatlng;

  const handleSubmit = (e) => {
    setCleanAlert(false);
    e.preventDefault();
    setIsSubmitted(true);
    if (noMissingValues) {
      dispatch(userRequest());
      dispatch(
        targetActions.create(
          radius,
          title,
          topic,
          newTargetlatlng.lat,
          newTargetlatlng.lng
        )
      );
    }
  };

  return (
    <form className="create-target-form" onSubmit={handleSubmit}>
      <p className="create-target-form__text">
        {intl.formatMessage({
          id: 'createtarget.specify.area.text',
        })}
      </p>
      <NumberFormat
        thousandSeparator={true}
        suffix={' m'}
        className="create-target-form__input"
        inputMode="numeric"
        name="radius"
        value={radius}
        onValueChange={handleChangeRadius}
      />
      {isSubmitted && !radius && (
        <div className="user-form__alert">
          {intl.formatMessage({
            id: 'createtarget.missing.radius.text',
          })}
        </div>
      )}
      <FormInput
        labelClassName="create-target-form__text"
        inputClassName="create-target-form__input"
        inputLabel={intl.formatMessage({
          id: 'createtarget.target.title.text',
        })}
        inputType="text"
        inputName="title"
        inputValue={title}
        inputOnChange={handleChange}
        inputPlaceHolder={intl.formatMessage({
          id: 'createtarget.title.placeholder.text',
        })}
        error={isSubmitted && !title}
        errorMsg={intl.formatMessage({
          id: 'createtarget.missing.title.text',
        })}
      />
      <p className="create-target-form__text">
        {intl.formatMessage({
          id: 'createtarget.select.topic.text',
        })}
      </p>
      <FormSelect
        customStyle={topicSelectStyle}
        customClassName="create-target-form__text create-target-form__select"
        optionsSet={topics}
        onChangeFunction={handleChangeTopic}
        valueSelect={select_topic}
        placeHolder={intl.formatMessage({
          id: 'createtarget.topic.placeholder.text',
        })}
        components={{
          Option: CustomSelectOption,
          SingleValue: CustomSelectValue,
        }}
        error={isSubmitted && !topic}
        errorMsg={intl.formatMessage({
          id: 'createtarget.missing.topic.text',
        })}
        alertClassName="create-target-form__alert-select"
      />
      <button type="submit" className="create-target-form__btn-text">
        {intl.formatMessage({
          id: 'createtarget.save.btn.text',
        })}
      </button>
      {createTargetRequest && <CustomLoader />}
      {showCreateTargetAlert && (
        <div className="user-form__alert"> {createTargetError} </div>
      )}
    </form>
  );
};

CreateTargetForm.propTypes = {
  newTargetlatlng: latLngShape,
  setNewTargetlatlng: func,
  newTargetRadius: string,
  setNewTargetRadius: func,
};

export default CreateTargetForm;
