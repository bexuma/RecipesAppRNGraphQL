import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { View, ActivityIndicator, ScrollView, TouchableOpacity, Button, FlatList, Image, Text, StyleSheet, TouchableHighlight, KeyboardAvoidingView } from 'react-native'
import { TextInput } from 'react-native-paper';

const signUpUserMutation = gql`
  mutation ($email: String!, $password: String!){
    createUser(authProvider: {email: {email: $email, password: $password}}) {
      id
    }
  }
`

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

class SignUp extends React.Component {
	static navigationOptions = {
    title: 'Sign up',
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

  handleSignUpButton = async () => {
    try {
      const {email, password} = this.state
      await this.props.signUpUserMutation({
       variables: {email, password}
      })

      const result = await this.props.signInUserMutation({
       variables: {email, password}
      })

      global.token = result.data.signinUser.token

      this.props.navigation.navigate('RecipeList', {
        user: result.data.signinUser.user
      })
    }
    catch(e) {
      console.log('EROOR', e)
    }
  }

  render () {
    if (this.props.signUpUserMutation.loading) {
      return (
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    if (this.props.signInUserMutation.loading) {
      return (
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

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
          style={styles.signUpButton}
          onPress={() => {
            this.handleSignUpButton()
          }}
          
        >
          <Text style={styles.signUpButtonText}>
            SignUp
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{padding: 8}}
          onPress={() => {
            this.props.navigation.navigate('SignIn')
          }}
        >
          <Text style={{textAlign: 'center'}}>
            Already have an account? Sign In
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
  signUpButton: {
    alignItems: 'center',
    backgroundColor: '#009688',
    padding: 10,
    marginTop: 10
  },
  signUpButtonText: {
    color: "#fff",
    fontWeight: 'bold'
  }

  
})

export default compose(graphql(signUpUserMutation, {name: 'signUpUserMutation'}), graphql(signInUserMutation, {name: 'signInUserMutation'}))(SignUp)




