import React from 'react'
import Layout from '../components/layout'
import Meta from '../components/meta'

export default class DefaultTemplate extends React.Component{
	render(){
		const {
			frontmatter,
			html,
			excerpt,
		} =  this.props.data.markdownRemark
		return(
			<Layout>
				<Meta
					title={frontmatter.title}
					description={excerpt}
				/>
				<div dangerouslySetInnerHTML={{ __html: html }} />
			</Layout>
		)
	}
}

export const query = graphql`
	query DefaultTemplate($slug: String!) {
		markdownRemark(fields: {
			slug: { eq: $slug }
		}){
			fileAbsolutePath
			html
			excerpt(pruneLength: 175)
			fields{
				slug
			}
			frontmatter{
				title
			}
		}
	}
`
