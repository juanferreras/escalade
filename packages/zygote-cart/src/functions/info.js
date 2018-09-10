import dotenv from 'dotenv'
import Stripe from 'stripe'
dotenv.config({ silent: true })
const stripe = Stripe(process.env.STRIPE_API_SECRET)

export async function handler({ body }, __, callback) {

	body = JSON.parse(body)

	// Validate product prices & stock here
	console.log(`Received from client:`, body)

	// Create empty result object to be sent later
	const res = {
		messages: {
			error: [],
		},
		modifications: [],
		meta: {},
	}

	// Create stripe order
	let order
	try {
		const obj = {
			currency: `usd`,
			email: body.infoEmail,
			items: body.products.map(({ id, quantity }) => {
				return {
					type: `sku`,
					parent: id,
					quantity,
				}
			}),
			shipping: {
				name: body.infoName,
				address: {
					line1: body.shippingAddress1,
					line2: body.shippingAddress2,
					city: body.shippingCity,
					postal_code: body.shippingZip,
					country: `US`,
				},
			},
		}
		if(body.coupon){
			obj.coupon = body.coupon
		}
		order = await stripe.orders.create(obj)
		console.log(`Received from Stripe:`, order)
	}
	catch(err){
		order = {}
		console.error(`Received error from Stripe:`, err)

		// Error messages
		// Create more consumer friendly inventory error message
		if (err.code === `out_of_inventory`){
			let item = Number(err.param
				.replace(`items[`, ``)
				.replace(`]`, ``))
			if(body.products[item]){
				res.step = `cart`
				res.messages.error.push(`Sorry! "${body.products[item].name}" is out of stock. Please lower the quantity or remove this product from your cart.`)
			}
		}
		else if (err.message) {
			res.messages.error.push(err.message)
		}

		if (err.param === `coupon`){
			res.step = `info`
		}
	}

	// Modifications
	if (order.items) {
		order.items.forEach(({ type, parent, amount, description }) => {
			if (type === `discount` || type === `tax` || type === `shipping`) {
				res.modifications.push({
					id: type === `discount` ? parent : type,
					value: amount / 100,
					description,
				})
			}
		})
	}


	// Get shipping
	if (order.shipping_methods) {
		res.shippingMethods = order.shipping_methods.map(({ id, amount, description }) => {
			return {
				id,
				value: amount / 100,
				description,
			}
		})
	}

	res.success = order.statusCode === 200
	if (order.selected_shipping_method){
		res.selectedShippingMethod = order.selected_shipping_method
	}
	if (order.id) {
		res.meta.orderId = order.id
	}

	console.log(`Sending to client:`, res)

	// Response
	callback(null, {
		statusCode: 200,
		body: JSON.stringify(res),
	})
}