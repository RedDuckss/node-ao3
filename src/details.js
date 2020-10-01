const got = require('got');
const { JSDOM } = require('jsdom');

async function details(id) {
	const detailsURL = `https://archiveofourown.org/works/${id}`;

	const response = await got(detailsURL);
	const dom = new JSDOM(response.body);

	const { document } = dom.window;

	return {
		title: document.querySelector('h2.title.heading').innerHTML.replace(/\n/g, '').trim(),
		author: document.querySelector('a[rel="author"]').innerHTML,
		language: document.querySelector('dd.language').innerHTML.replace(/\n/g, '').trim(),
		published: document.querySelector('dd.published').innerHTML,
		updated: document.querySelector('dd.status').innerHTML,
		words: document.querySelector('dd.words').innerHTML,
		chapters: document.querySelector('dd.chapters').innerHTML.split('/')[0], // remove the "/?"
		comments: document.querySelector('dd.comments').innerHTML,
		kudos: document.querySelector('dd.kudos').innerHTML,
		bookmarks: document.querySelector('dd.bookmarks a').innerHTML,
		hits: document.querySelector('dd.hits a').innerHTML,
		summary: document.querySelector('div.summary blockquote.userstuff p').innerHTML,
		tags: {
			rating: [...document.querySelectorAll('dd.rating.tags a')].map(ratingTagElement => ratingTagElement.innerHTML),
			warning: [...document.querySelectorAll('dd.warning.tags a')].map(warningTagElement => warningTagElement.innerHTML),
			category: [...document.querySelectorAll('dd.category.tags a')].map(categoryTagElement => categoryTagElement.innerHTML),
			fandom: [...document.querySelectorAll('dd.fandom.tags a')].map(fandomTagElement => fandomTagElement.innerHTML),
			relationship: [...document.querySelectorAll('dd.relationship.tags a')].map(relationshipTagElement => relationshipTagElement.innerHTML),
			character: [...document.querySelectorAll('dd.character.tags a')].map(characterTagElement => characterTagElement.innerHTML),
			freeform: [...document.querySelectorAll('dd.freeform.tags a')].map(freeformTagElement => freeformTagElement.innerHTML),
		}
	};
}

module.exports = details;