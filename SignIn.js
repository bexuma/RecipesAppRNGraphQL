import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { View, ScrollView, TouchableOpacity, Button, FlatList, Image, Text, StyleSheet, TouchableHighlight, KeyboardAvoidingView } from 'react-native'
import { TextInput } from 'react-native-paper';

const signInUserMutation = gql`
  mutation ($email: String!, $password: String!){
    signinUser(email: {email: $email, password: $password}) {
      token
      user {
        id
      }
    }
  }
`

class SignIn extends React.Component {
	static navigationOptions = {
    title: 'Sign in',
    headerLeft: null,
    headerStyle: {
      backgroundColor: '#009688',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    }
  };

  state = {
    email: '',
    password: ''
  }

  handleSignInButton = async () => {
    try {
      const {email, password} = this.state
      const result = await this.props.signInUserMutation({
       variables: {email, password}
      })

      global.token = result.data.signinUser.token
      this.props.navigation.navigate('RecipeList', {
        user: result.data.signinUser.user
      })
    }
    catch(e) {
      alert("Email or password does not match")
    }

  }

  render () {

    return (
    	<View style={styles.container}>
        <TextInput
          label='Email'
          underlineColor="#159688"
          placeholder='Type your email...'
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />

        <TextInput
          label='Password'
          underlineColor="#159688"
          placeholder='Type your password...'
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />

        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => {
            this.handleSignInButton()
          }}
          
        >
          <Text style={styles.signInButtonText}>
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{padding: 8}}
          onPress={() => {
            this.props.navigation.navigate('SignUp')
          }}
        >
          <Text style={{textAlign: 'center'}}>
            Do not have an account? Sign Up
          </Text>
        </TouchableOpacity>

      </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 16
  },
  signInButton: {
    alignItems: 'center',
    backgroundColor: '#009688',
    padding: 10,
    marginTop: 10
  },
  signInButtonText: {
    color: "#fff",
    fontWeight: 'bold'
  }

  
})

export default graphql(signInUserMutation, {name: 'signInUserMutation'})(SignIn)