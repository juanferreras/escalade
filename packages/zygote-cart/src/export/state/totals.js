import { State } from 'statable'
import productsState from './products'

const totalsState = new State({
	subtotal: 0,
	modifications: [],
	total: 0,
}, {
	addModification(newModification){
		/*
		{
			id: `10OFF`,
			description: `10% off discount`,
			displayValue: `-10%`,
			alteration: () => {
				return totalsState.state.subtotal * -.1
			}
		}
		*/
		if(Array.isArray(newModification)){
			this.setState({
				modifications: newModification,
			})
		}
		else {
			const modifications = [...this.state.modifications]
			// See if already exists
			let modificationExists = false
			if (newModification.id) {
				for (let i = modifications.length; i--;) {
					let mod = modifications[i]
					if (mod.id && newModification.id === mod.id){
						modificationExists = true
						modifications[i] = newModification
					}
				}
			}
			// Add new modification
			if (!modificationExists) {
				modifications.push(newModification)
			}
			this.setState({ modifications })
		}
		this.calculateTotals()
	},

	calculateSubtotal(){
		const { products } = productsState.state
		let subtotal = 0
		products.forEach(({ quantity, price }) => {
			subtotal += quantity * price
		})
		this.setState({ subtotal })
	},

	calculateTotal(){
		const { subtotal, modifications } = this.state
		let total = subtotal
		console.log(total)
		modifications.forEach(mod => {
			mod.calculatedValue = typeof mod.alteration === `function`
				? mod.alteration()
				: mod.alteration
			total += mod.calculatedValue
		})
		this.setState({ total })
	},

	calculateTotals(){
		this.calculateSubtotal()
		this.calculateTotal()
	},
})

export default totalsState