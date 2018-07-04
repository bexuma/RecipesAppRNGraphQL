import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { ApolloProvider } from 'react-apollo'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import RecipeList from './RecipeList'
import Recipe from './Recipe';

const httpLink = new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cjd2s0bub97io0123o8twdrjt' })

const client = new ApolloClient({
  link: httpLink,
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
  },
  {
    initialRouteName: 'RecipeList',
  }
);

console.disableYellowBox = true;


