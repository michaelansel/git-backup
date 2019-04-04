'use strict'

const got = require('got')
const fs = require('fs')

const parseRepoList = (url) => //new Promise((resolve,reject) => resolve({test:"data"}))
	got(url)
	.catch((error) => console.error(`Error retrieving repo list for ${url}: ${error}`))
	.then((res) => JSON.parse(res.body))
	.then((repos) => repos.map((r) => ([
		{
			  owner:       r.owner.login
			, repo:        r.name
			, clone_url:   r.clone_url
		}
		, r.has_wiki ? {
			  owner:       r.owner.login
			, repo:        r.name + '.wiki'
			, clone_url:   r.clone_url.replace(/\.git$/,'.wiki.git')
		} : null
	])).flat().filter(a => !!a), () => [])

const stars = (user) => parseRepoList(`https://api.github.com/users/${user}/starred`)
const orgs = () => Promise.all(
		fs.readFileSync("orgs.txt","utf8").split("\n").filter((line) => line.length > 0).map((org) => parseRepoList(`https://api.github.com/orgs/${org}/repos`))
	).then((results) => Array.prototype.concat.apply([],results))
const users = () => Promise.all(
		fs.readFileSync("users.txt","utf8").split("\n").filter((line) => line.length > 0).map((user) => parseRepoList(`https://api.github.com/users/${user}/repos`))
	).then((results) => Array.prototype.concat.apply([],results))

Promise.all([
	stars('michaelansel'),
	orgs(),
	users(),
]).then((results)=>Array.prototype.concat.apply([],results)).then(JSON.stringify).then(console.log)
