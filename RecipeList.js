import React from 'react'
import Recipe from './Recipe'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { View, TouchableHighlight, ActivityIndicator, Modal, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native'

const allRecipesQuery = gql`
  query {
    allRecipes {
      id
      title
      description
      ingredients
      instructions
    }
  }
`

class RecipeList extends React.Component {

  static navigationOptions = {
    title: 'Recipe list',
    headerStyle: {
      backgroundColor: '#159688',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    }
  };

  constructor(props) {
    super(props)
    this.state = {
      recipes: [],
      modalVisible: false,
      user: undefined,
    }

  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.allRecipesQuery.loading && !nextProps.allRecipesQuery.error) {
      this.setState({
        recipes: nextProps.allRecipesQuery.allRecipes,
      })
    }
  }

  renderRecipe = ({ item }) => {
    const { navigation } = this.props;
    return (
      <TouchableOpacity style={styles.recipe} onPress={() =>
          navigation.navigate('Recipe', {
            recipe: item,
          })
        }>
        <Text>{item.title}</Text>
      </TouchableOpacity>
    )
  }

  render () {
    if (this.props.allRecipesQuery.loading) {
      return (
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )

    }

    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.recipes}
          renderItem={this.renderRecipe}
        />
      </View>
    )
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  recipe: {
    flex: 1,
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomColor: '#f4f4f4',
    borderBottomWidth: 1,
  },
  createPostButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  createPostButton: {
    backgroundColor: 'rgba(39,174,96,1)',
    color: 'white',
    textAlign: 'center',
    fontSize: 22,
    height: 60,
    width: 480,
    paddingTop: 18,
  }
})

export default graphql(allRecipesQuery, {name: 'allRecipesQuery'})(RecipeList)