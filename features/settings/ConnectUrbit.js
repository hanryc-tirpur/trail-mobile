import React, { useEffect, } from 'react'
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text as DefaultText
} from 'react-native'

import { Text, View } from '../../external/pongo/screens/../components/Themed'
import Button from '../../external/pongo/screens/../components/form/Button'
import { keyboardAvoidBehavior, keyboardOffset } from '../../external/pongo/screens/../constants/Layout'
import { medium_gray } from '../../external/pongo/screens/../constants/Colors'
import { useUrbitActions } from '../../external/pongo/screens/../../../hooks/useUrbitStore'

import { useConnectionProcessActions, useConnectionProcessConnection, useConnectionProcessUrl } from './hooks/useConnectionProcess'
import useShipEntry from './hooks/useShipEntry'
import useAccessCodeEntry from './hooks/useAccessCodeEntry'


function EnterShipUrl() {
  const {
    deselectedProtocol,
    selectedProtocol,
    setSelectedProtocol,
    setShipUrl,
    shipUrl,
    urlInputRef,
  } = useShipEntry()
  const { validateUrl } = useConnectionProcessActions()
  const { isValidatingUrl, urlProblem } = useConnectionProcessUrl()

  return (
    <View>
      <Text style={styles.label}>
        Enter the url to your urbit ship: {isValidatingUrl && 'LOADING'}
      </Text>
      {/* TODO: put a selector here for https/http that prepopulates the form and focuses */}
      <View>
        <TouchableOpacity style={styles.changeHttp} onPress={setSelectedProtocol}>
          <DefaultText style={{ textAlign: 'center', backgroundColor: medium_gray, color: 'white' }}>
            Change to {deselectedProtocol}
          </DefaultText>
        </TouchableOpacity>
        <TextInput
          ref={urlInputRef}
          style={styles.input}
          onChangeText={setShipUrl}
          value={shipUrl}
          placeholder={`${selectedProtocol}your-ship.net`}
          keyboardType='url'
          autoCorrect={false}
          autoFocus
        />
        {urlProblem && (
          <Text style={{ color: 'red' }}>
            {urlProblem}
          </Text>
        )}
      </View>
      <Button style={styles.topMargin16} title='Continue' onPress={() => validateUrl(shipUrl)} />
    </View>
  )
}

export default function ConnectUrbit() {
  const { completeConnectionProcess } = useConnectionProcessActions()
  const {
    acceptedUrl,
    authCookie,
    isConnected,
    ship,
  } = useConnectionProcessConnection()
  const { connect } = useUrbitActions()

  useEffect(() => {
    if(isConnected) {
      connect({
        authCookie,
        shipUrl: acceptedUrl,
        ship,
      })
      completeConnectionProcess()
    }
  }, [isConnected])

  return (
    <KeyboardAvoidingView behavior={keyboardAvoidBehavior} style={styles.shipInputView} keyboardVerticalOffset={keyboardOffset}>
      { acceptedUrl !== null
      ? (<LoginToShip />)
      : (<EnterShipUrl />)
      }
    </KeyboardAvoidingView>
  )
}

function LoginToShip() {
  const {
    accessCode,
    setAccessCode,
    setShowPassword,
    showPassword,
  } = useAccessCodeEntry()
  const {
    acceptedUrl,
    loginProblem,
    ship,
  } = useConnectionProcessUrl()
  const {
    attemptLogin,
    removeUrl,
  } = useConnectionProcessActions()

  return (
    <>
      <Text style={styles.label}>
        Please enter your Access Key:
      </Text>
      <TextInput
        style={styles.input}
        value={ship}
        placeholder='sampel-palnet'
        editable={false}
      />
      <View style={{ position: 'relative' }}>
        <TextInput
          style={styles.input}
          onChangeText={setAccessCode}
          value={accessCode}
          placeholder='sampel-ticlyt-migfun-falmel'
          maxLength={27}
          secureTextEntry={!showPassword}
          keyboardType={showPassword ? 'default' : 'default'}
          autoComplete='off'
          autoCapitalize='none'
          autoFocus
          textContentType='password'
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showPassword}>
          <Text style={styles.showPasswordText}>{showPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      {loginProblem && (
        <Text style={{ color: 'red' }}>
          {loginProblem}
        </Text>
      )}
      <Button style={styles.topMargin16} title='Continue' onPress={() => attemptLogin(accessCode)} />
      <Button style={styles.topMargin16} title='Log in with a different ID' onPress={removeUrl} />
    </>
  )
}


const styles = StyleSheet.create({
  stage: {
    backgroundColor: '#EFEFF4', // Change to #000 to preview Dark Mode/Appereance
    paddingTop: 20,
    paddingBottom: 20,
  },
  changeHttp: {
    backgroundColor: medium_gray,
    borderRadius: 8,
    padding: 4,
    paddingHorizontal: 4,
    width: 120,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  label: {
    fontSize: 20,
    margin: 16,
    alignSelf: 'center',
  },
  input: {
    height: 40,
    marginTop: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white'
  },
  shipInputView: {
    padding: 20,
    height: '100%',
  },
  showPassword: {
    padding: 4,
    position: 'absolute',
    right: 8,
    top: 18,
    color: 'gray',
  },
  showPasswordText: {
    color: 'black',
  },
  topMargin16: { marginTop: 16 },
})
