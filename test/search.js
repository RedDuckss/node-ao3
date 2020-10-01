const ao3 = require('..');

(async () => {
	const results = await ao3.search('My Hero');

	console.log(results[0]);
})();