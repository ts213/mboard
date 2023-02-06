import { useReducer } from 'react';

const initialState = {
  name: '',
  email: '',
  nameError: null,
  emailError: null,
  formCompleted: false,
  formSubmitted: false,
};

function formReducer(state, action) {
  console.log(state, action);
  let error;
  switch (action.type) {
    case 'name_changed':
      error = validate('name', action.payload);
      return { ...state, name: action.payload, nameError: error };
    case 'email_changed': {
      error = validate('email', action.payload);
      return { ...state, email: action.payload, emailError: error }
    }
    case 'form_submitted': {
      // if the form has been successfully submitted,
      // stop here to prevent rage clicks and re-submissions
      if (state.formCompleted) return state;
      let formValid = true;
      // invalidate the form if values are missing or in error
      if (state.nameError || !state.name || state.emailError || !state.email) {
        formValid = false
      }
      // if the user has attempted to submit before, stop here
      if (state.formSubmitted) return { ...state, formCompleted: formValid };
      // if this is the first submit, we need to validate in case the user
      // clicked submit without typing anything
      let nameError = validate('name', state.name);
      let emailError = validate('email', state.email);
      return {
        ...state,
        nameError,
        emailError,
        formSubmitted: true,
        formCompleted: formValid,
      }
    }
    default:
      return state
  }
}

// it's outside our reducer to make things more readable and DRY
function validate(inputField, value) {
  if (typeof value === 'string') value = value.trim();
  switch (inputField) {
    case 'name':
      if (value.length === 0)
        return 'Must enter name';
      else if (value.split(' ').length < 2)
        return 'Must enter first and last name';
      else
        return null;

    case 'email':
      if (value.length === 0)
        return 'Must enter email';
      else if (
        !value.includes('@') ||
        !value.includes('.') ||
        value.split('.')[1].length < 2
      ) return 'Must enter valid email';
      else
        return null;
  }
}

export function FormExample() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  // extract our dispatch to a change handler to DRY the code up
  function handleChange(e) {
    dispatch({ type: e.target.name + '_changed', payload: e.target.value })
  }

  // this is attached to the form, not the submit button so that
  // the user can click OR press 'enter' to submit
  // we don't need a payload, the input values are already in state
  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'form_submitted' })
  }

  const columnStyle = {
    display: 'flex',
    flexDirection: 'column',
  };

  const inputStyle = hasError => ({ outline: hasError && state.formSubmitted ? '3px solid red' : 'none' })

  return (
    <form style={{ ...columnStyle, width: '300px' }} onSubmit={handleSubmit}>
      <label style={columnStyle}>
        <span>Name:</span>
        <input
          style={inputStyle(state.nameError)}
          onChange={handleChange}
          name='name'
          value={state.name}
          type='text'
        />
        <span>{state.formSubmitted && state.nameError}</span>
      </label>
      <label style={columnStyle}>
        <span>email:</span>
        <input
          style={inputStyle(state.emailError)}
          onChange={handleChange}
          name='email'
          value={state.email}
          type='text'
        />
        <span>{state.formSubmitted && state.emailError}</span>
      </label>
      <button type='submit'>Submit</button>
      <p>{state.formCompleted && 'Form Submitted Successfully!'}</p>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </form>
  )
}
