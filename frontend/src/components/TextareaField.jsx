// components/TextareaField.jsx
import React from "react";

const TextareaField = ({ name, value, onChange, placeholder, rows = 4, required }) => {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className="textarea-field"
    />
  );
};

export default TextareaField;
