// components/InputField.jsx
import React from "react";

const InputField = ({ type = "text", name, value, onChange, placeholder,required = false, ...props }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      {...props}
      className="input-field" // apply your custom CSS class here

    />
  );
};

export default InputField;
