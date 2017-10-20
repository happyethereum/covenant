const RouterDom = require('react-router-dom');
const Link = RouterDom.Link;
const React = require('react');

const NavBarLink = ({ to, currentLocation, label }) => {
	const isActive = currentLocation === to || currentLocation.indexOf(`${to}/`) === 0;
	return (
		<li className={"nav-item " + (isActive ? 'active' : '')}>
			<Link to={to} className="nav-link">{label}</Link>
		</li>
	);
};

module.exports = NavBarLink;