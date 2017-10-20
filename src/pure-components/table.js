const PropTypes = require('prop-types');
const React = require('react');

const Table = ({ columns = [], data = []}) => {
	return (
		<table className="table">
			<thead>
				<tr>
					{columns.map((col, index) => {
						return (<th key={index}>{col.label}</th>);
					})}
				</tr>
			</thead>
			<tbody>
				{data.map((datum, dataIndex) => {
					return (
						<tr key={dataIndex}>
						{columns.map((col, colIndex) => {
							let value;
							if (typeof col.value === 'function') {
								value = col.value(datum);
							} else {
								value = datum[col.value];
							}
							const key=`${dataIndex}-${colIndex}`;
							if (col.action) {
								const disabled = col.disabled ? col.disabled(datum) : false;
								if (disabled) {
									return null;
								} else {
									return (<td key={key}><a href="#" onClick={() => col.action(datum)}>{value}</a></td>);
								}
							} else {
								return (<td key={key}>{value}</td>);
							}
						})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

Table.propTypes = {
	data: PropTypes.array,
	columns: PropTypes.arrayOf(PropTypes.shape({
		label: PropTypes.string,
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.func
		]).isRequired,
		action: PropTypes.func,
		disabled: PropTypes.func
	}))
};

module.exports = Table;