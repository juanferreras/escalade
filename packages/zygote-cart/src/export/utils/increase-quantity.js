import productState from '../state/products'
import calculateTotals from './calculate-totals'

export default function increaseQuantity(id, n = 1) {
	let products = [...productState.state.products]
	for (let i = products.length; i--;) {
		const product = products[i]
		if (product.id === id) {
			product.quantity += n
			if(typeof product.stock === `number`){
				if(product.quantity > product.stock){
					product.quantity = product.stock
				}
			}
			break
		}
	}
	productState.setState({ products })
	calculateTotals()
}