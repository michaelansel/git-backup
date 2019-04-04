'use strict'

const got = require('got')

const stars = (user) =>
	got(`https://api.github.com/users/${user}/starred`)
	.then((res) => JSON.parse(res.body))
	.then((starred) => starred.map((s) => ({
		  owner:       s.owner.login
		, repo:        s.name
		, clone_url:   s.clone_url
	})))

stars('michaelansel').then(JSON.stringify).then(console.log)
