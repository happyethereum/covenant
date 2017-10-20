const Table = require('./Table');
const formatWeiForDisplay = require('../../eth/format-wei-for-display');

const getStatusListColumns = () => {
	return [
		{
			label: 'Status',
			value: (exitData) => {
				if (exitData.isComplete) {
					return 'Exit Complete';
				} else {
					return 'Pending Payment';
				}
			}
		},
		{
			label: 'Operator',
			value: 'operatorContract'
		},
		// {
		// 	label: 'Exit Booth',
		// 	value: 'exitBooth'
		// },
		{
			label: 'Deposit',
			value: (trip) => {
				const deposit = trip.deposit;
				return deposit ? formatWeiForDisplay(deposit) : '';
			}
		},
		{
			label: 'Final Fee',
			value: (trip) => {
				const fee = trip.fee;
				return fee ? formatWeiForDisplay(fee) : '';
			}
		},
		{
			label: 'Refund',
			value: (trip) => {
				const refund = trip.refund;
				return refund ? formatWeiForDisplay(refund) : '';
			}
		},
	];
};

const ExitStatusList = ( { statusList = [] } ) => {

	const columns = getStatusListColumns();
	if (statusList.length === 0) {
		return (<p>Watching for exit activity ...</p>);
	}
	return (<Table data={statusList} columns={columns} />);
};

module.exports = ExitStatusList;