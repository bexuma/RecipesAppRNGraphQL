import React from 'react'
import { graphql } from 'react-apollo'
import { gql } from 'apollo-boost'
import { View, ScrollView, TouchableOpacity, FlatList, Image, Text, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { TextInput } from 'react-native-paper';
import { ImagePicker } from 'expo';

const createRecipeMutation = gql`
  mutation ($title: String!, $description: String!, $ingredients: [String!]!, $instructions: [String!]!, $imageUrl: String!, $authorId: ID!){
    createRecipe(title: $title, description: $description, ingredients: $ingredients, instructions: $instructions, imageUrl: $imageUrl, authorId: $authorId) {
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
    ingredients: [],
    instructions: [],
    image: ''
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
    const authorId = navigation.getParam('authorId', '')
    const ingredientInputText = (this.state.ingredients.length === 0)
    		? 'Insert an ingredient...'
    		: 'Insert one more ingredient...'
    const instructionInputText = (this.state.instructions.length === 0)
    		? 'Insert an instruction...'
    		: 'Insert one more instruction...'

    let { image } = this.state;

    return (
    	<KeyboardAvoidingView
    		behavior="padding"
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

        <Text style={[styles.header, {paddingTop: 2}]}>Ingredients</Text>

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
        		Add ingredient
        	</Text>

        </TouchableOpacity>

        <Text style={[styles.header, {paddingTop: 10}]}>Instructions</Text>

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
        		Add instruction
        	</Text>

        </TouchableOpacity>

        {image
            ? (<Image source={{ uri: image.uri }} style={{ height: 200, marginTop: 10 }} />)
            : null }
        
        <TouchableOpacity
          style={[styles.button, styles.addImagebutton]}
          onPress={this.pickImage}
        >
          <Text style={styles.buttonText}>
            Choose an image
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
        	style={styles.submitButton}
        	onPress={() => {
<<<<<<< HEAD
            this.uploadPhoto(this.state.title, pictureUrl)
          	// this._createRecipe()
          	// allRecipesQuery.refetch()
          	// this.props.navigation.goBack()
=======
            this._createRecipe(image, authorId);
          	allRecipesQuery.refetch()
          	this.props.navigation.goBack()
>>>>>>> 43a56931693cb44e94b1a4705e753a1c90534ff9
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

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ image: result });
    }
  };

  _createRecipe = async (image, authorId) => {
    let data = new FormData()
    data.append('data', {uri: image.uri, name: 'Recipe', type: 'multipart/form-data'})

    try {
      const res = await fetch('https://api.graph.cool/file/v1/cjd2s0bub97io0123o8twdrjt', {
        method: 'POST',
        body: data
      })
      const resJson = await res.json();
      // alert(JSON.stringify(resJson));
      // console.log('resJson: ', resJson)
      const {title, description, ingredients, instructions} = this.state
      await this.props.createRecipeMutation({
       variables: {title, description, ingredients, instructions, imageUrl: resJson.url, authorId: authorId}
      })

    } catch (err) {
      console.log('err', err)
    }
    
  }

  uploadPhoto = (localUri, filename) => {
    const formData = new FormData()
    const data = {
      uri: localUri,
      name: 'test.jpg',
      type: 'image/jpeg',
    }

    formData.append('data', data)

    const options = {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }

    return fetch('https://api.graph.cool/file/v1/cjd2s0bub97io0123o8twdrjt', options)
    .then((response) => {
      return response.json()
    }).then((image) => {
      alert(image)
      return image
    })
    .catch(error => console.error(`Error uploading image`))
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
    backgroundColor: '#26A69A',
    padding: 10
  },
  buttonText: {
    color: "#fff",
    fontWeight: 'bold'
  },
  addImagebutton: {
    marginTop: 10,
    backgroundColor: '#009688',
  },
  submitButton: {
  	alignItems: 'center',
    backgroundColor: '#00796B',
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