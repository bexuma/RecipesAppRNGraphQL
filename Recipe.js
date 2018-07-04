import React from 'react'
import { ScrollView, Image, Text, StyleSheet, FlatList } from 'react-native'

export default class Recipe extends React.Component {
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

  render () {
    const { navigation } = this.props;
    const recipe = navigation.getParam('recipe', '')

    return (
      <ScrollView style={styles.container}>

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
          style={[styles.section, styles.blank]}
          data={recipe.instructions}
          renderItem={this.renderInstruction}
        />
        
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10
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
  blank: {
    marginBottom: 40
  }

})