import { StrictMode, useMemo } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from "apollo-upload-client";
import { onError } from "@apollo/client/link/error";

import App from './app/app';
import { ErrorNotifier } from './app/components/ErrorNotifier';
import { AUTH_TOKEN } from './constants';
import { environment } from './environments/environment';
import { notifyError } from './app/utils';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const wsLink = new WebSocketLink({
  uri: `${environment.ws}/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN)
    }
  }
});

const uploadLink = createUploadLink({
  uri: `${environment.api}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const link = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
	},
  wsLink,
  authLink.concat(uploadLink)
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
	<StrictMode>
		<ErrorNotifier>
			{(showError: any) => (
				<MyApolloProvider showError={showError}>
					<BrowserRouter>
						<App />
					</BrowserRouter>
      	</MyApolloProvider>
			)}
		</ErrorNotifier>
  </StrictMode>
);


const MyApolloProvider = ({ showError, children }: { showError: any, children: any }) => {
	const apolloClient = useMemo(
		() => {
			// fetchPolicy: 'no-cache', -- for disabling apollo global cache
			const baseOptions: any = { errorPolicy: "all" };

			return new ApolloClient({
				defaultOptions: {
					watchQuery: baseOptions,
					query: baseOptions,
					mutate: baseOptions,
				},
				cache: new InMemoryCache(),
				link: ApolloLink.from([
					onError(({ graphQLErrors, networkError }) => {
						// if (networkError) {
						// 	showError();
						// }

						if (graphQLErrors) {
							try {
								const error = graphQLErrors[0]?.extensions['response'] as { statusCode: number, message: string };
								const exception = graphQLErrors[0]?.extensions['exception'] as { status: number, message: string }
								if (error?.statusCode === 401 || graphQLErrors[0]?.message?.includes('Invalid token')) {
									window.location.replace('/');
									localStorage.removeItem(AUTH_TOKEN);
								} else if (exception.status === 400 || exception.status === 409) {
									notifyError(exception.message);
								} else {
									notifyError(exception.message);
									// showError();
								}

								if (graphQLErrors[0]?.message) {
									notifyError(graphQLErrors[0]?.message);
								}
							} catch (error) {
								console.log(error);
							}
						}
					}),
					link,
				]),
			})
		},
		[]
	);
 
  return (
		<ApolloProvider client={apolloClient}>
			<ToastContainer />
      {children}
    </ApolloProvider>
  );
}