import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import { setContext } from 'apollo-link-context';
import RecipeList from './RecipeList'
import Recipe from './Recipe'
import CreateRecipe from './CreateRecipe'
import SignIn from './SignIn'

const httpLink = new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cjd2s0bub97io0123o8twdrjt' })

global.token = ""

console.disableYellowBox = true

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      authorization: "Bearer " + global.token
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <RootStack />
      </ApolloProvider>
    )
  }
}

const RootStack = createStackNavigator(
  {
    RecipeList: RecipeList,
    Recipe: Recipe,
    CreateRecipe: CreateRecipe,
    SignIn: SignIn
  },
  {
    initialRouteName: 'SignIn',
  }
);

