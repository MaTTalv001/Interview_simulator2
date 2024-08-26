import React from 'react';

const SelectField = ({ value, onChange, options, placeholder }) => {
    return (
      <select
        value={value}
        onChange={onChange}
        className="select select-bordered w-full bg-base-100 text-base-content"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={typeof option === 'object' ? option.value : option}>
            {typeof option === 'object' ? option.value : option}
          </option>
        ))}
      </select>
    );
  };

export default SelectField;