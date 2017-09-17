import React from 'react';
import './index.css';

const Form = ({ onAddEmployee }) => {
  let person, position;
  return (
    <form 
      className="form-container"
      onSubmit={(event) => {
      if (onAddEmployee(
        person.value,
        position.value, 
        event
      )) {
      person.value = '';
      position.value = '';
    }}}>
      <label>Person: {` `}
        <input 
          className="form-input"
          maxLength='20'
          placeholder='...'
          ref={ node =>
          person = node
        }
        />
      </label>
      <label>Position: {` `}
        <input
          className="form-input"
          maxLength='20'
          placeholder='...'
          ref={ node =>
          {position = node}
        }
        />
      </label>
      <button 
        className="form-btn add-btn"
      >
        Add Employee
      </button>
    </form>
  );
}

export default Form;