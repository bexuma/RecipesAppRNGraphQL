import React from 'react'
import { ScrollView, Image, Text, StyleSheet, FlatList, TouchableOpacity, Share } from 'react-native'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const deleteRecipeMutation = gql`
  mutation ($id: ID!){
    deleteRecipe(id: $id) {
      id
    }
  }
`

class Recipe extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.recipe.title,
    headerStyle: {
      backgroundColor: '#159688',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    }
  });

  renderIngredient = ({ item }) => {
    return (
      <Text style={styles.ingredient}>{item}</Text>
    )
  }

  renderInstruction = ({ item, index }) => {
    return (
      <Text style={styles.instruction}>{index + 1}. {item}</Text>
    )
  }

  handleOnPressShareButton = (recipeTitle) => {
    Share.share({
      message: 'http://n17r.com',
      title: recipeTitle
    }, {
      // Android only:
      dialogTitle: 'Share recipe',
    })
  }

  handleOnPressDeleteButton = async (recipeId) => {
    await this.props.deleteRecipeMutation({
     variables: {id: recipeId}
    })
    this.props.onComplete()
  }

  render () {
    const { navigation } = this.props;
    const recipe = navigation.getParam('recipe', '')
    const allRecipesQuery = navigation.getParam('allRecipesQuery', '');

    return (
      <ScrollView style={styles.container}>

        <Image
          style={{height: 200, marginBottom: 10}}
          source={{uri: recipe.imageUrl}}
        />

        <Text style={styles.header}>
          Описание
        </Text>

        <Text style={[styles.description, styles.section]}>
          {recipe.description}
        </Text>

        <Text style={styles.header}>
          Ингредиенты
        </Text>

        <FlatList
          style={styles.section}
          data={recipe.ingredients}
          renderItem={this.renderIngredient}
        />

        <Text style={styles.header}>
          Инструкция
        </Text>

        <FlatList
          style={styles.section}
          data={recipe.instructions}
          renderItem={this.renderInstruction}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.handleOnPressShareButton(recipe.title)}>

          <Text style={styles.buttonText}>Share</Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {marginBottom: 28, backgroundColor: '#00796B'}]}
          onPress={() => {
            this.handleOnPressDeleteButton(recipe.id)
            allRecipesQuery.refetch()
            this.props.navigation.goBack()
          }}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        
      </ScrollView>
    )
  }
}

export default graphql(deleteRecipeMutation, {name: 'deleteRecipeMutation'})(Recipe)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 15
  },
  title: {
    fontSize: 20
  },
  description: {
    fontSize: 15
  },
  section: {
    marginBottom: 18
  },
  header: {
    fontSize: 20,
    marginBottom: 5
  },
  ingredient: {
    marginBottom: 3
  },
  instruction: {
    marginBottom: 10
  },
  button: {
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#159688',
    padding: 10
  },
  buttonText: {
    color: "#fff",
    fontWeight: 'bold'
  }

})