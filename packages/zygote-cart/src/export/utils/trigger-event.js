import settingsState from '../state/settings'
import capitalize from './capitalize'
import successState from '../state/success'

export default function eventTrigger(type, data){
	settingsState.state[`on${capitalize(type)}`](data)
	const { ga } = global
	if (settingsState.state.googleAnalytics && ga){
		ga(`send`, {
			hitType: `event`,
			eventCategory: `Zygote`,
			eventAction: type,
		})
		if(type === `order`){
			const {
				meta,
				totals,
			} = successState.state
			ga(`require`, `ecommerce`)
			ga(`ecommerce:addTransaction`, {
				id: meta.orderId || `${Date.now()}`,
				revenue: totals.total,
				shipping: getValue(`shipping`),
				tax: getValue(`tax`),
			})
			successState.state.products.forEach(prod => {
				ga(`ecommerce:addItem`, prod)
			})
			ga(`ecommerce:send`)
			ga(`ecommerce:clear`)
		}
	}
}

function getValue(id){
	const { modifications } = successState.state.totals
	for (let i = modifications.length; i--;){
		if(modifications[i].id === id){
			return modifications[i].value
		}
	}
	return 0
}