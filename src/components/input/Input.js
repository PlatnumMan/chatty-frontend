import '@components/input/Input.scss';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// const Input = ({ id, name, type, value, className, style, labelText, placeholder, handleChange }) => {
//   return (
//     <>
//       <div className="form-row">
//         {labelText && (
//           <label htmlFor={name} className="form-label">
//             {labelText}
//           </label>
//         )}

//         <input
//           id={id}
//           name={name}
//           type={type}
//           value={value}
//           onChange={handleChange}
//           placeholder={placeholder}
//           className={`form-input ${className}`}
//           style={style}
//           autoComplete="false"
//         />
//       </div>
//     </>
//   );
// };

const Input = forwardRef((props, ref) => (
  <div className="form-row">
    {props.labelText && (
      <label htmlFor={props.name} className="form-label">
        {props.labelText}
      </label>
    )}

    <input
      ref={ref}
      id={props.id}
      name={props.name}
      type={props.type}
      value={props.value}
      onChange={props.handleChange}
      placeholder={props.placeholder}
      onClick={props.onClick}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      className={`form-input ${props.className}`}
      style={props.style}
      autoComplete="false"
    />
  </div>
));

Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string,
  labelText: PropTypes.string,
  value: PropTypes.any,
  className: PropTypes.string,
  style: PropTypes.object,
  placeholder: PropTypes.string,
  handleChange: PropTypes.func,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};

export default Input;
