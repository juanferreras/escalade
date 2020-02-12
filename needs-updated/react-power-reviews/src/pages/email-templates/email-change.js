import React from 'react'
import Layout from '../../components/layouts/identity-email'

export default class EmailIdentityEmailChange extends React.Component {
	render() {
		return (
			<Layout>
				<h2>Confirm Change of Email</h2>
				<p>Follow this link to confirm the update of your email from {`{{ .Email}}`} to {`{{ .NewEmail}}`}:</p>
				<p>
					<a href='{{ .SiteURL }}/admin/#email_change_token={{ .Token }}'>Change Email</a>
				</p>
			</Layout>
		)
	}
}