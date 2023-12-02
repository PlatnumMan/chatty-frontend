import Button from '../../../components/button/Button';
import Input from '../../../components/input/Input';
import './Register.scss';

const Register = () => {
  return (
    <div className="auth-inner">
      {/* <div className="alerts alert-error" role="alert">
        Error message
      </div> */}
      <form className="auth-form">
        <div className="form-input-container">
          <Input
            id="username"
            name="username"
            type="text"
            value="value"
            labelText="Username"
            placeholder="Enter username"
          />
          <Input id="email" name="email" type="email" value="email@email" labelText="Email" placeholder="Enter Email" />
          <Input
            id="password"
            name="password"
            type="password"
            value="value password"
            labelText="Password"
            placeholder="Enter Password"
          />
        </div>
        <Button label={'SIGNUP'} className="auth-button button" disabled={false} />
      </form>
    </div>
  );
};

export default Register;
