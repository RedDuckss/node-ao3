const ao3 = require('..');

(async () => {
	const results = await ao3.search('My Hero');
	const fic = results[0];

	const details = await ao3.details(fic.id);

	console.log(details);
})();