import React from 'react'
import Recipe from './Recipe'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ActionButton from 'react-native-action-button';
import { View, ActivityIndicator, RefreshControl, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native'

const allRecipesQuery = gql`
  query {
    allRecipes {
      id
      title
      description
      ingredients
      instructions
      imageUrl
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
      refreshing: false,
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
            allRecipesQuery: this.props.allRecipesQuery,
          })
        }>
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text numberOfLines={2} >
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.props.allRecipesQuery.refetch().then(() => {
      this.setState({refreshing: false});
    });
  }

  render () {
    global.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MzM0NjA3NzcsImlhdCI6MTUzMDg2ODc3NywicHJvamVjdElkIjoiY2pkMnMwYnViOTdpbzAxMjNvOHR3ZHJqdCIsInVzZXJJZCI6ImNqajlwaXZwZWZiZDQwMTkzeWxidjZ4ZGgiLCJhdXRoRGF0YSI6eyJlbWFpbCI6ImFiY0BnbWFpbC5jb20ifSwibW9kZWxOYW1lIjoiVXNlciJ9.M0yZ1CH-X3IVohK4Xo_2HFhDVoSE20iz_PgDa6y_WG8"
    
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
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        />
        <ActionButton
          buttonColor="rgba(231,76,60,1)"
          onPress={() => {
            this.props.navigation.navigate('CreateRecipe', {
              allRecipesQuery: this.props.allRecipesQuery,
            })
          }}
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
  title: {
    fontWeight: 'bold',
    fontSize: 15
  },
  recipe: {
    flex: 1,
    flexDirection: 'row',
    height: 80,
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