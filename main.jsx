import React from 'react';
import {Accounts, STATES} from './fix.js'; // TODO: back to normal once std:accounts-ui is fixed
import {Button as MuiButton, Icon, TextField, Divider, Snackbar} from 'material-ui';
import {socialButtonsStyles, socialButtonIcons} from './social_buttons_config';
import {green, red, yellow, lightBlue} from 'material-ui/colors';


const styles = {
  button: {
    marginRight: '6px'
  },
  buttonIcon: {
    marginRight: '6px'
  }
}

/**
 * Form.propTypes = {
 *   fields: React.PropTypes.object.isRequired,
 *   buttons: React.PropTypes.object.isRequired,
 *   error: React.PropTypes.string,
 *   ready: React.PropTypes.bool
 * };
 */

class LoginForm extends Accounts.ui.LoginForm {
  componentWillMount() {
    // FIXME hack to solve issue #18
  }
}

class Form extends Accounts.ui.Form {

  render() {
    const {
      hasPasswordService,
      oauthServices,
      fields,
      buttons,
      error,
      message,
      ready = true,
      className,
      formState
    } = this.props;
    return (
      <form noValidate autoComplete="off"
        ref={(ref) => this.form = ref}
        className={["accounts", className].join(' ')}>
        {Object.keys(fields).length > 0
          ? (<Accounts.ui.Fields fields={fields}/>)
          : null}
        <Accounts.ui.Buttons buttons={buttons}/>
        <br/>
        {formState == STATES.SIGN_IN || formState == STATES.SIGN_UP
          ? (
            <div className="or-sep">
              <Accounts.ui.PasswordOrService oauthServices={oauthServices}/>
            </div>
          )
          : null}
        {formState == STATES.SIGN_IN || formState == STATES.SIGN_UP
          ? (<Accounts.ui.SocialButtons oauthServices={oauthServices}/>)
          : null}
        <br/>
        <Accounts.ui.FormMessage {...message}/>
      </form>
    );
  }
}

class Buttons extends Accounts.ui.Buttons {}
class Button extends Accounts.ui.Button {
	render() {
		const {
			label,
			href = null,
			type,
			disabled = false,
			onClick,
			className,
			icon
		} = this.props;
    const Icon = icon;
    return (
      <MuiButton
        raised={ type != 'link' }
        href={href}
        className={className}
        onClick={onClick}
        disabled={disabled}
        style={styles.button}
      >
        {Icon ? <Icon style={styles.buttonIcon} /> : ''}
        {label}
      </MuiButton>
    );
	}
}
class Fields extends Accounts.ui.Fields {
	render() {
		let {
			fields = {},
			className = ""
		} = this.props;
		return (
			<div className={[className].join(' ')}>
				{Object.keys(fields).map((id, i) => <Accounts.ui.Field key={i} {...fields[id]}/>)}
			</div>
		);
	}
}
class Field extends Accounts.ui.Field {
	render() {
		const {
			id,
			hint,
			label,
			type = 'text',
			onChange,
			required = false,
			className,
			defaultValue = ""
		} = this.props;
		const {
			mount = true
		} = this.state;
		return mount
			? (<TextField
				label={label}
				placeholder={hint}
				onChange={onChange}
				fullWidth={true}
				defaultValue={defaultValue}
				name={id}
				type={type}
				ref={(ref) => this.input = ref}
				required={ !!required }
        InputProps={{
          inputProps: {
            autoCapitalize: type == 'email' ? 'none'	: false,
            autoCorrect: "off"
          }
        }} />)
			: null;
	}
}
class SocialButtons extends Accounts.ui.SocialButtons {
	render() {
		let {
			oauthServices = {},
			className = "social-buttons"
		} = this.props;
		if (Object.keys(oauthServices).length > 0) {
			return (
				<div className={[className].join(' ')}>
					{Object.keys(oauthServices).map((id, i) => {
						const ServiceIcon = socialButtonIcons[id];
						const {label, type, onClick, disabled} = oauthServices[id];
            const serviceClass = 'oauth-service-' + id;
            const style = Object.assign(socialButtonsStyles[id] || {}, styles.button);

						return (
							<MuiButton raised	key={i}
								type={type}
								onClick={onClick}
								disabled={disabled}
								className={serviceClass}
								style={style}
							>
                {ServiceIcon ? <ServiceIcon style={styles.buttonIcon} /> : ''}
                {label}
              </MuiButton>
						);
					})}
				</div>
			)
		} else {
			return null;
		}
	}
}


const bodyStyleColor = {
  warning: yellow[600],
  success: green[500],
  error: red[500],
  info: lightBlue[600],
};

class FormMessage extends Accounts.ui.FormMessage {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message) {
      this.setState({open: true});
    }
  }

  handleRequestClose() {
    this.setState({open: false});
  };

  render() {
    const {message, type} = this.props;
    const {open} = this.state;
    const bodyStyle = {
      backgroundColor: bodyStyleColor[type]
    };

    return message
      ? (<Snackbar
        open={open}
        message={message}
        bodyStyle={bodyStyle}
        action="OK"
        autoHideDuration={4000}
        onActionTouchTap={this.handleRequestClose.bind(this)}
        onRequestClose={this.handleRequestClose.bind(this)}/>)
      : null;
  }
}

// Notice! Accounts.ui.LoginForm manages all state logic at the moment, so avoid overwriting this
// one, but have a look at it and learn how it works. And pull requests altering how that works are
// welcome. Alter provided default unstyled UI.
Accounts.ui.LoginForm = LoginForm;
Accounts.ui.Form = Form;
Accounts.ui.Buttons = Buttons;
Accounts.ui.Button = Button;
Accounts.ui.Fields = Fields;
Accounts.ui.Field = Field;
Accounts.ui.FormMessage = FormMessage;
Accounts.ui.SocialButtons = SocialButtons;

// Export the themed version.
export {Accounts, STATES};
export default Accounts;
