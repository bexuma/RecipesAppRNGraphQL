import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { View, ScrollView, TouchableOpacity, FlatList, Image, Text, StyleSheet, TouchableHighlight, KeyboardAvoidingView } from 'react-native'
import { TextInput } from 'react-native-paper';

const createRecipeMutation = gql`
  mutation ($title: String!, $description: String!, $ingredients: [String!]!, $instructions: [String!]!){
    createRecipe(title: $title, description: $description, ingredients: $ingredients, instructions: $instructions) {
      id
    }
  }
`

class CreateRecipe extends React.Component {
	static navigationOptions = {
    title: 'Create new recipe',
    headerStyle: {
      backgroundColor: '#009688',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    }
  };

  state = {
  	title: '',
    description: '',
    ingredient: '',
    instruction: '',
    ingredients: ['dsf', 'sdfsdf', 'sdfsdf', 'sdfdsf'],
    instructions: [],
  }

  handleAddIngredientForm = () => {
  	this.setState({
  		ingredients: [...this.state.ingredients, this.state.ingredient],
  		ingredient: ''
  	})
  }

  handleAddInstructionForm = () => {
  	this.setState({
  		instructions: [...this.state.instructions, this.state.instruction],
  		instruction: ''
  	})
  }

  render () {
  	const { navigation } = this.props;
    const allRecipesQuery = navigation.getParam('allRecipesQuery', '');
    const ingredientInputText = (this.state.ingredients.length === 0)
    		? 'Type an ingredient...'
    		: 'Add one more ingredient...'
    const instructionInputText = (this.state.ingredients.length === 0)
    		? 'Type an instruction...'
    		: 'Add one more instruction...'

    return (
    	<KeyboardAvoidingView
    		behavior="position"
        contentContainerStyle={{ flex: 1 }}
        style={{ flex: 1 }}
        keyboardVerticalOffset={32}
        enabled
      >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
      	<TextInput
      		label='Title'
          underlineColor="#159688"
          placeholder='Recipe title...'
          onChangeText={title => this.setState({ title })}
          value={this.state.title}
        />

        <TextInput
        	label='Description'
        	multiline={true}
        	underlineColor="#159688"
          placeholder='Type a description...'
          onChangeText={description => this.setState({ description })}
          value={this.state.description}
        />

        <Text style={styles.header}>Ingredients</Text>

        <FlatList
          data={this.state.ingredients}
          renderItem={({item}) => <View style={styles.item}><Text style={styles.itemText}>{item}</Text></View>}
        />

        <TextInput
        	label='Ingredient'
        	underlineColor="#159688"
          placeholder={ingredientInputText}
          onChangeText={ingredient => this.setState({ ingredient })}
          value={this.state.ingredient}
        />

        <TouchableOpacity
        	onPress={this.handleAddIngredientForm}
        	style={styles.button}
        >
        	<Text style={styles.buttonText}>
        		Add more ingredients
        	</Text>

        </TouchableOpacity>


        <FlatList
          data={this.state.instructions}
          renderItem={({item}) => <View style={styles.item}><Text style={styles.itemText}>{item}</Text></View>}
        />

        <TextInput
        	label='Instruction'
        	underlineColor="#159688"
          placeholder={instructionInputText}
          onChangeText={instruction => this.setState({ instruction })}
          value={this.state.instruction}
        />

        <TouchableOpacity
        	onPress={this.handleAddInstructionForm}
        	style={styles.button}
        >
        	<Text style={styles.buttonText}>
        		Add more instructions
        	</Text>

        </TouchableOpacity>

        <TouchableOpacity
        	style={styles.submitButton}
        	onPress={() => {
          	this._createRecipe()
          	allRecipesQuery.refetch()
          	this.props.navigation.goBack()
          }}
        	
        >
        	<Text style={styles.submitButtonText}>
        		Create Recipe
        	</Text>
        </TouchableOpacity>

      </ScrollView>
      </KeyboardAvoidingView>
    )
  }

   _createRecipe = async () => {
     const {title, description, ingredients, instructions} = this.state
     await this.props.createRecipeMutation({
       variables: {title, description, ingredients, instructions}
     })
     this.props.onComplete()
   }
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 16
  },
  header: {
  	fontWeight: 'bold',
  	fontSize: 16,
  	color: "#757575",
  	marginTop: 10
  },
  item: {
  	flex: 1,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingLeft: 2,
    paddingRight: 2,
    borderBottomColor: '#f4f4f4',
    borderBottomWidth: 1,
  },
  itemText: {
  	fontSize: 15
  },
  button: {
  	alignItems: 'center',
    backgroundColor: '#009688',
    padding: 10
  },
  buttonText: {
    color: "#fff",
    fontWeight: 'bold'
  },
  submitButton: {
  	alignItems: 'center',
    backgroundColor: '#00695C',
    padding: 10,
    marginTop: 10,
    marginBottom: 16
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: 'bold',
    fontSize: 18
  },
  
})

export default graphql(createRecipeMutation, {name: 'createRecipeMutation'})(CreateRecipe)