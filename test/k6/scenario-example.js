import http from "k6/http"
import { group, check, sleep } from "k6"

const BASE_URL = "https://mitali-chavan-bakehouse.cta-training.academy/"

export const options = {
	scenarios: {
		bounce: {
			exec: "homeJourney",
			executor: "ramping-vus",
			startVUs: 0,
			stages: [
				{ duration: "30s", target: 1 },
				{ duration: "570s", target: 1 },
			],
			gracefulRampDown: "5s",
		},
		products: {
			exec: "productsJourney",
			executor: "ramping-vus",
			startVUs: 0,
			stages: [
				{ duration: "30s", target: 1 },
				{ duration: "570s", target: 1 },
			],
			gracefulRampDown: "5s",
		},
		customers: {
			exec: "customerJourney",
			executor: "ramping-vus",
			startVUs: 0,
			stages: [
				{ duration: "30s", target: 1 },
				{ duration: "570s", target: 1 },
			],
			gracefulRampDown: "5s",
		},
		postCustomer: {
			exec: "postNewCustomerJourney",
			executor: "ramping-vus",
			startVUs: 0,
			stages: [
				{ duration: "30s", target: 1 },
				{ duration: "570s", target: 1 },
			],
			gracefulRampDown: "5s",
		},
		postProduct: {
			exec: "postNewProductJourney",
			executor: "ramping-vus",
			startVUs: 0,
			stages: [
				{ duration: "30s", target: 1 },
				{ duration: "570s", target: 1 },
			],
			gracefulRampDown: "5s",
		},
		postOrder: {
			exec: "postNewOrderJourney",
			executor: "ramping-vus",
			startVUs: 0,
			stages: [
				{ duration: "30s", target: 1 },
				{ duration: "570s", target: 1 },
			],
			gracefulRampDown: "5s",
		},
	},

	thresholds: {
		http_req_duration: ["p(95)<250", "max<2000"],
		http_req_failed: ["rate<0.1"],
	},
}

export function homeJourney() {
	group("home journey", () => {
		simpleGetRequest(BASE_URL, '<div id="root"></div>')
		sleep(5)
	})
}

export function productsJourney() {
	group("products journey", () => {
		simpleGetRequest(BASE_URL)
		sleep(5)
		simpleGetRequest(`${BASE_URL}api/products`, "victoria_sponge_slice")
		sleep(5)
	})
}

export function customerJourney() {
	group("customer journey", () => {
		simpleGetRequest(BASE_URL)
		sleep(5)
		simpleGetRequest(`${BASE_URL}api/customers`, "Alice Baker")

		sleep(5)
	})
}

export function postNewCustomerJourney() {
	let randomNum = Math.floor(Math.random() * 1000)

	group("post new customer journey", () => {
		simpleGetRequest(BASE_URL)
		sleep(5)
		simplePostRequest(
			`${BASE_URL}api/customers`,
			{
				name: `TestMC ${randomNum}`,
				email: `test.mc${randomNum}@email.com`,
			},
			`"status":"created"`,
		)
		sleep(5)
	})
}

export function postNewProductJourney() {
	let randomNum = Math.floor(Math.random() * 1000)

	group("post new product journey", () => {
		simpleGetRequest(BASE_URL)
		sleep(5)
		simplePostRequest(
			`${BASE_URL}api/products`,
			{
				name: `TestProdMC ${randomNum}`,
				category: "TestProd",
				price: 1,
			},
			`"status":"created"`,
		)
		sleep(5)
	})
}

export function postNewOrderJourney() {

	group("post new order journey", () => {
		simpleGetRequest(BASE_URL)
		sleep(5)
		simplePostRequest(
			`${BASE_URL}api/orders`,
			{
				customerId: 1,
				items: [{ productId: 1, quantity: 1 }],
			},
			`"status":"created"`,
		)
		sleep(5)
	})
}

function simpleGetRequest(pageUrl, expectedText = null) {
	const res = http.get(pageUrl)
	sleep(1)
	const success = check(res, {
		"status was 200": (r) => r.status === 200,
		...(expectedText && {
			"page contains expected text": (r) => r.body.includes(expectedText),
		}),
	})

	if (!success) {
		console.log(`\nFAILED REQUEST: ${pageUrl}`)
		console.log(`Status: ${res.status}`)

		if (expectedText) {
			console.log(`Expected text: ${expectedText}`)
			console.log(`Response body: ${res.body.substring(0, 500)}`)
		}
	}

	return res
}

function simplePostRequest(pageUrl, data, expectedText = null) {
	const res = http.post(pageUrl, JSON.stringify(data), {
		headers: { "Content-Type": "application/json" },
	})
	console.log(res.json().json)
	sleep(1)

	const success = check(res, {
		"status was 201": (r) => r.status === 201,
		...(expectedText && {
			"page contains expected text": (r) => r.body.includes(expectedText),
		}),
	})

	if (!success) {
		console.log(`\nFAILED REQUEST: ${pageUrl}`)
		console.log(`Status: ${res.status}`)

		if (expectedText) {
			console.log(`Expected text: ${expectedText}`)
			console.log(`Response body: ${res.body.substring(0, 500)}`)
		}
	}
}
