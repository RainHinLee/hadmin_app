
var data = {};

[
	require('./plan.js'),
	require('./timetable.js')
].forEach(item =>{
	Object.assign(data,item)
});

module.exports = data;

