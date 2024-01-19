
Url: `http://10.160.4.56:7654/`

Valid methods: `GET`

## Endpoints
- `/give_me_json`

	Code: `200`

	Returns: { test: true, a: 1, b: 2 }

- `/give_me_plain_text`

	Code: `200`

	Returns: `Congrats`

- `/add`

	Get parameters:
	- `a` -> Number
	- `b` -> Number

	Code: `200`, `400`, `500`

	Returns: { a: ?, b: ?, sum: ? }

- `/page/:npage`

	`:npage` -> Number

	Code: `200`, `404`

	Returns: `You're on page ?`, `Page not found`

- `/error/:httpCode`

	`:httpCode` HTTP Code of the response

	Default code: `500`

	Returns: Javascript error as a string

- `/redirect`

	Code: `307`
	
	Redirect to: `/give_me_plain_text`