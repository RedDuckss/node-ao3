const got = require('got');
const { JSDOM } = require('jsdom');

async function search(query) {
	const searchURL = `https://archiveofourown.org/works/search?utf8=✓&work_search[query]=${query}`;

	const response = await got(searchURL);
	const dom = new JSDOM(response.body);

	const results = [...dom.window.document.querySelectorAll('[role="article"]')]
		.map(element => ({
			id: element.id.split('work_')[1],
			title: element.querySelector('h4.heading a').innerHTML,
			author: element.querySelector('a[rel="author"]').innerHTML,
			fandoms: [
				...element.querySelectorAll('h5.fandoms a.tag')
			].map(fandomElement => fandomElement.innerHTML),
			required_tags: [
				...element.querySelectorAll('ul.required-tags li a span.text')
			].map(requireTagElement => requireTagElement.innerHTML),
			date: element.querySelector('p.datetime').innerHTML,
			tags: {
				rating: [...element.querySelectorAll('ul.tags.commas li.ratings')].map(ratingTagElement => ratingTagElement.innerHTML),
				warning: [...element.querySelectorAll('ul.tags.commas li.warnings a')].map(warningTagElement => warningTagElement.innerHTML),
				category: [...element.querySelectorAll('ul.tags.commas li.categorys a')].map(categoryTagElement => categoryTagElement.innerHTML),
				fandom: [...element.querySelectorAll('ul.tags.commas li.fandoms a')].map(fandomTagElement => fandomTagElement.innerHTML),
				relationship: [...element.querySelectorAll('ul.tags.commas li.relationships a')].map(relationshipTagElement => relationshipTagElement.innerHTML),
				character: [...element.querySelectorAll('ul.tags.commas li.characters a')].map(characterTagElement => characterTagElement.innerHTML),
				freeform: [...element.querySelectorAll('ul.tags.commas li.freeforms a')].map(freeformTagElement => freeformTagElement.innerHTML),
			},
			summary: element.querySelector('blockquote p').innerHTML,
			stats: {
				lang: element.querySelector('dl.stats dd.language')?.innerHTML,
				words: element.querySelector('dl.stats dd.words')?.innerHTML,
				chapters: element.querySelector('dl.stats dd.chapters a')?.innerHTML,
				comments: element.querySelector('dl.stats dd.comments a')?.innerHTML,
				kudos: element.querySelector('dl.stats dd.kudos a')?.innerHTML,
				bookmarks: element.querySelector('dl.stats dd.bookmarks a')?.innerHTML,
				hits: element.querySelector('dl.stats dd.hits')?.innerHTML
			}
		}));

	return results;
}

module.exports = search;