const React = require('react');
const PropTypes = require('prop-types');

const ChooseAccountDropdown = (props) => {
	const { accounts, selectedAccount, onSelect, label, action } = props;
	  if (accounts.length === 0) {
	  	    return (
		        <input className="form-control"
		               type="text"
		               style={{minWidth: '250px'}}
		               placeholder={`${label} Address`}
		               onChange={(evt) => {
		               	    const value = evt.target.value;
		               	    onSelect(value);
		               }}
		        />
	        );
	  } else {
	  	return (
		    <select className="form-control"
		            value={selectedAccount || ''}
		            onChange={(event) => onSelect(event.target.value)}>
			    <option>{`${action} ${label} Address`}</option>
			    {accounts.map((account, index) => {
				    return (
					    <option key={index} value={account}>{account}</option>
				    );
			    })}
		    </select>
	    );
	  }
};

ChooseAccountDropdown.propTypes = {
	accounts: PropTypes.arrayOf(PropTypes.string).isRequired,
	selectedAccount: PropTypes.string,
	onSelect: PropTypes.func,
	label: PropTypes.string,
	action: PropTypes.string
};

ChooseAccountDropdown.defaultProps = {
	label: "Account",
	action: "Choose",

};

module.exports = ChooseAccountDropdown;