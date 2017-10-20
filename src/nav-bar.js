import NavBarLink from './nav-bar-link';
require('./nav-bar.css');
const React = require('react');
import { withRouter } from 'react-router'

const NavBar = (props) => {
	const location = props.location.pathname;
	return (
		<div>
		<nav className="navbar navbar-dark bg-dark fixed-top navbar-expand-lg">
			<a className="navbar-brand" href="#">Road Network</a>
			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>
			<div className="collapse navbar-collapse" id="navbarText">
				<ul className="navbar-nav">
					<NavBarLink to="/borrower" label="Borrower" currentLocation={location} />
					<NavBarLink to="/auditor" label="Auditor" currentLocation={location} />
				</ul>
			</div>
		</nav>
			<div className="navbar-spacer"></div>
		</div>
	);
};

export default withRouter(NavBar);