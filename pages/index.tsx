import type { NextPage } from 'next'

import { Exchanges } from '../data/coingecko'
import useRouterStatus from '../hooks/useRouterStatus'
import Head from 'next/head'
import Exchange from '../components/Exchange'
import { Pagination } from '../components/Pagination'

interface Props {
	exchanges: ExchangeSummary[]
	page: number
	limit: number
	total: number
}

const HomePage: NextPage<Props> = ({ exchanges, page, limit, total }) => {
	const { isLoading, isError, error } = useRouterStatus()

	if (isError) {
		return <p>something wehnt wrong {error}</p>
	}

	return (
		<>
			<Head>
				<title>Exchanges List</title>
			</Head>
			<ul>
				{exchanges.map((exchange) => (
					<li key={exchange.id}>
						{isLoading ? (
							<Exchange.LoadingSummary />
						) : (
							<Exchange.Summary exchange={exchange} />
						)}
					</li>
				))}
			</ul>
			{!isLoading && <Pagination key={page} current={page} total={total} />}
			<style jsx>{`
				ul {
					@apply mx-auto max-w-4xl grid gap-4 grid-cols-1 md:(grid-cols-2);
				}
			`}</style>
		</>
	)
}

HomePage.getInitialProps = async ({ query }) => {
	try {
		const page = parseInt(query.page as string) || 1
		return await Exchanges.Get(page)
	} catch (e) {
		return { exchanges: [], page: 1, limit: 10, total: 1 }
	}
}

export default HomePage
