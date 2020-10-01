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
			date: element.querySelector('p.datetime'),
			tags: [
				...element.querySelectorAll('ul.tags.commas li')
			].map(tagElement => ({
				type: tagElement.className,
				value: tagElement.querySelector('a.tag').innerHTML
			})),
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