import React from 'react'
import classNames from 'classnames'

export default class Button extends React.Component {
	render() {
		const {
			onClick,
			children,
			secondary,
			disabled,
			dataTestid,
		} = this.props
		return (
			<button
				className={classNames(
					`zygoteBtn`,
					!secondary ? `zygotePrimaryBtn` : `zygoteSecondaryBtn`,
				)}
				onClick={onClick}
				disabled={disabled}
				type='button'
				data-testid={dataTestid}
			>
				{children}
			</button>
		)
	}
	static styles = ({ borderColor, backgroundColor, primaryColor, fontColor }) => ({
		'.zygoteBtn': {
			borderRadius: 20,
			textAlign: `center`,
			padding: 10,
			maxWidth: `100%`,
			width: 250,
			fontWeight: `bold`,
			margin: `10px auto`,
			display: `block`,
			fontSize: `1em`,
			outline: `none`,
			border: 0,
			cursor: `pointer`,
			':hover, :focus': {
				opacity: .7,
			},
			':disabled': {
				backgroundColor: borderColor,
				cursor: `default`,
				color: backgroundColor,
				':hover': {
					opacity: 1,
				},
			},
		},
		'.zygoteBtnSmall': {
			width: `auto`,
			margin: `5px 0 0 0`,
			fontSize: `12px`,
			padding: `5px 10px`,
		},
		'.zygotePrimaryBtn': {
			backgroundColor: primaryColor,
			color: backgroundColor,
		},
		'.zygoteSecondaryBtn': {
			border: `1px solid ${borderColor}`,
			color: fontColor,
		},
	})
}