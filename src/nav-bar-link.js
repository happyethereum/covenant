const ReactRouter = require('react-router');
const Link = ReactRouter.Link;

const NavBarLink = ({ to, currentLocation, label }) => {
	const isActive = currentLocation === to || currentLocation.indexOf(`${to}/`) === 0;
	return (
		<li className={"nav-item " + (isActive ? 'active' : '')}>
			<Link to={to} className="nav-link">{label}</Link>
		</li>
	);
};

module.exports = NavBarLink;