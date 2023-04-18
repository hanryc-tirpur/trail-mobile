import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity, Text as DefaultText } from "react-native";

import storage from "../util/storage";
import QrCodeScanner from "../components/handshake/QRCodeScanner";
import { Text, View } from "../components/Themed";
import useStore from "../state/useStore";
import { URBIT_HOME_REGEX } from "../util/regex";
import Button from "../components/form/Button";
import { isIos, keyboardAvoidBehavior, keyboardOffset } from "../constants/Layout";
import { medium_gray } from "../constants/Colors";
import CreateAccountScreen from "./CreateAccount";
import useColors from "../hooks/useColors";
import useKeyboard from "../hooks/useKeyboard";
import useDimensions from "../hooks/useDimensions";
import { useUrbitActions } from "../../../hooks/useUrbitStore";

const SHIP_COOKIE_REGEX = /(~)[a-z\-]+?(\=)/;
const getShipFromCookie = (cookie: string) => cookie.match(SHIP_COOKIE_REGEX)![0].slice(0, -1);

type LoginType = 'scan' | 'url' | 'create-account' | 'email-login' | null

export default function LoginScreen({ inviteUrl }: { inviteUrl?: string }) {
  const { ships, ship, shipUrl, authCookie, addShip, clearShip, setShipUrl, setShip } = useStore();
  const urlInputRef = useRef<any>(null)
  const { color } = useColors()
  const { isKeyboardVisible } = useKeyboard()
  const { height } = useDimensions()

  const [shipUrlInput, setShipUrlInput] = useState('https://');
  const [accessKeyInput, setAccessKeyInput] = useState('');
  const [urlProblem, setUrlProblem] = useState<string | null>();
  const [loginProblem, setLoginProblem] = useState<string | null>();
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [loginType, setLoginType] = useState<LoginType>(null);

  const { connect: connectUrbit } = useUrbitActions()
  console.log('why is this undefined?', connectUrbit)

  useEffect(() => {
    if (inviteUrl) {
      setLoginType('create-account')
    }
  }, [inviteUrl])

  const changeUrl = useCallback(() => {
    clearShip();
  }, []);

  const handleSaveUrl = useCallback(async () => {
    setFormLoading(true);
    const leadingHttpRegex = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/i;
    const noPrefixRegex = /^[A-Za-z0-9]+\.([\w#!:.?+=&%@!\-\/])+$/i;

    const prefixedUrl = noPrefixRegex.test(shipUrlInput) && !leadingHttpRegex.test(shipUrlInput) ? `https://${shipUrlInput}` : shipUrlInput;
    const formattedUrl = (prefixedUrl.endsWith("/") ? prefixedUrl.slice(0, prefixedUrl.length - 1) : prefixedUrl).replace('/apps/escape', '');

    if (!formattedUrl.match(leadingHttpRegex)) {
      setUrlProblem('Please enter a valid ship URL.');
    } else {
      let isValid = false;
      const response = await fetch(formattedUrl)
        .then((res) => {
          isValid = true;
          return res;
        })
        .catch(console.error);

      if (isValid) {
        setShipUrl(formattedUrl);

        const authCookieHeader = response?.headers.get('set-cookie') || 'valid';
        if (typeof authCookieHeader === 'string' && authCookieHeader?.includes('urbauth-~')) {
          // TODO: handle expired auth or determine if auth has already expired
          const ship = getShipFromCookie(authCookieHeader);
          addShip({ ship, shipUrl: formattedUrl, authCookie: authCookieHeader });
        } else {
          const html = await response?.text();
          if (html) {
            const stringMatch = html.match(/<input value="~.*?" disabled="true"/i) || [];
            const ship = stringMatch[0]?.slice(14, -17);
            if (ship) {
              addShip({ ship, shipUrl: formattedUrl });
            } else {
              setShipUrl('')
              setUrlProblem('Please ensure your ship is accessible and try again.')
            }
          }
        }
      } else {
        setUrlProblem('There was an error, please check the URL and try again.');
      }
    }
    setFormLoading(false);
  }, [shipUrlInput, addShip, setUrlProblem]);

  const handleLogin = useCallback(async () => {
    setFormLoading(true);
    const regExpPattern = /^((?:[a-z]{6}-){3}(?:[a-z]{6}))$/i;

    if (!accessKeyInput.match(regExpPattern)) {
      setLoginProblem('Please enter a valid access key.');
    } else {
      setLoginProblem(null);
      const formBody = `${encodeURIComponent('password')}=${encodeURIComponent(accessKeyInput)}`;
      
      await fetch(`${shipUrl}/~/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
      })
        .then(async (response) => {
          const authCookieHeader = response.headers.get('set-cookie') || '';
          if (!authCookieHeader) {
            setLoginProblem('Please enter a valid access key.');
          } else {
            connectUrbit({ ship, shipUrl, authCookie: authCookieHeader })
            addShip({ ship, shipUrl, authCookie: authCookieHeader })
          }
        })
        .catch((err) => {
          console.error(err)
          console.warn('ERROR LOGGING IN')
        })
    }
    setFormLoading(false);
  }, [accessKeyInput, setLoginProblem]);

  const handleScan = (result: string) => {
    fetch(result, { method: "POST" })
      .then((res) => res.json())
      .then((json) => {
        if ("error" in json) alert(json.error);
        else if ("ok" in json) {
          const url = new URL(result);
          handleQRLogin(url.origin, json.ok);
        }
      })
      .catch((e) => console.warn("ERROR LOGGING IN"));
  }
  const handleQRLogin = (url: string, code: string) => {
    const formBody = `${encodeURIComponent("password")}=${encodeURIComponent(
      code
    )}`;
    fetch(`${url}/~/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formBody,
    })
      .then(async (response) => {
        const authCookieHeader = response.headers.get("set-cookie") || "";
        if (!authCookieHeader) {
          setLoginProblem("Invalid QR code"); // wouldn't get this far, though
        } else {
          if (
            typeof authCookieHeader === "string" &&
            authCookieHeader?.includes("urbauth-~")
          ) {
            // TODO: handle expired auth or determine if auth has already expired
            const ship = getShipFromCookie(authCookieHeader);
            addShip({ ship, shipUrl: url, authCookie: authCookieHeader });
          } else {
            const html = await response?.text();
            if (html) {
              const stringMatch = html.match(/<input value="~.*?" disabled="true"/i) || [];
              const ship = stringMatch[0]?.slice(14, -17);
              if (ship)
                addShip({ ship, shipUrl: url });
            }
          }
        }
      })
      .catch((err) => {
        console.warn("ERROR LOGGING IN");
      });
  }

  const styles = useMemo(() => StyleSheet.create({
    logo: {
      height: height < 700 && isKeyboardVisible ? 60 : 120,
      width: height < 700 && isKeyboardVisible ? 60 : 120,
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
    welcome: {
      marginTop: 16,
      fontSize: 24,
      fontWeight: "600",
    },
    label: {
      fontSize: 20,
      margin: 16,
      alignSelf: 'center',
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
    topMargin16: { marginTop: 16 },
  }), [isKeyboardVisible, height])

  const renderContent = () => {
    if (!shipUrl && loginType === 'scan') {
      return (
        <>
          <Text style={styles.label}>
            Please scan your Urbit QR code:
          </Text>
          <QrCodeScanner onScan={handleScan} />
          <Button style={styles.topMargin16} title="Back" onPress={() => setLoginType(null)} />
        </>
      )
    } else if (!shipUrl && loginType === 'url') {
      return (
        <>
          <Text style={styles.label}>
            Enter the url to your urbit ship:
          </Text>
          {/* TODO: put a selector here for https/http that prepopulates the form and focuses */}
          <View>
            <TouchableOpacity style={styles.changeHttp} onPress={() => {
              setShipUrlInput(shipUrlInput.includes('https') ? 'http://' : 'https://')
              urlInputRef?.current.focus()
            }}>
              <DefaultText style={{ textAlign: 'center', backgroundColor: medium_gray, color: 'white' }}>
                Change to {shipUrlInput.includes('https') ? 'http' : 'https'}
              </DefaultText>
            </TouchableOpacity>
            <TextInput
              ref={urlInputRef}
              style={styles.input}
              onChangeText={setShipUrlInput}
              value={shipUrlInput}
              placeholder="http(s)://your-ship.net"
              keyboardType="url"
              autoCorrect={false}
              autoFocus
            />
            {urlProblem && (
              <Text style={{ color: "red" }}>
                {urlProblem}
              </Text>
            )}
          </View>
          <Button style={styles.topMargin16} title="Continue" onPress={handleSaveUrl} />
          <Button style={styles.topMargin16} title="Back" onPress={() => setLoginType(null)} />
        </>
      )
    } else if (shipUrl) {
      return (
        <>
          <Text style={styles.label}>
            Please enter your Access Key:
          </Text>
          <TextInput
            style={styles.input}
            value={ship}
            placeholder="sampel-palnet"
            editable={false}
          />
          <View style={{ position: 'relative' }}>
            <TextInput
              style={styles.input}
              onChangeText={setAccessKeyInput}
              value={accessKeyInput}
              placeholder="sampel-ticlyt-migfun-falmel"
              maxLength={27}
              secureTextEntry={!showPassword}
              keyboardType={showPassword ? 'default' : "default"}
              autoComplete='off'
              autoCapitalize="none"
              autoFocus
              textContentType="password"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showPassword}>
              <Text style={styles.showPasswordText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
          {loginProblem && (
            <Text style={{ color: "red" }}>
              {loginProblem}
            </Text>
          )}
          <Button style={styles.topMargin16} title="Continue" onPress={handleLogin} />
          <Button style={styles.topMargin16} title="Log in with a different ID" onPress={changeUrl} />
        </>
      )
    }

    return (
      <>
        <Text style={{ marginLeft: '10%', marginTop: isIos ? 48 : 24, fontSize: 18 }}>Urbit:</Text>
        <Button style={{ marginTop: 8 }} title="Login with URL" onPress={() => setLoginType('url')} />
        <Text style={{ marginLeft: '10%', marginTop: 32, fontSize: 18 }}>Red Horizon Hosting:</Text>
        <Button style={{ marginTop: 8 }} title="Login with Email" onPress={() => setLoginType('email-login')} />
        <Button style={styles.topMargin16} title="Create Account" onPress={() => setLoginType('create-account')} />
        {/* <Text style={styles.topMargin16}>Already Logged In?</Text>
        <Button title="Refresh Connection" onPress={loadStorage} /> */}
      </>
    )
  }

  if (formLoading) {
    return <View style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color={color} />
    </View>
  } else if (loginType === 'create-account') {
    return <CreateAccountScreen inviteUrl={inviteUrl} method="create" goBack={() => setLoginType(null)} />
  } else if (loginType === 'email-login') {
    return <CreateAccountScreen method="login" goBack={() => setLoginType(null)} />
  }

  return (
    <KeyboardAvoidingView behavior={keyboardAvoidBehavior} style={styles.shipInputView} keyboardVerticalOffset={keyboardOffset}>
      <View style={{ alignItems: 'center', marginTop: isKeyboardVisible ? 20 : 60 }}>
        <Image style={styles.logo} source={require('../../assets/images/pongo-logo.png')} />
        <Text style={styles.welcome}>Pongo by Uqbar</Text>
      </View>
      {renderContent()}
      {(ships.length > 0 && !authCookie) && (
        <Button style={styles.topMargin16} title="Cancel" onPress={() => setShip(ships[0].ship)} />
      )}
    </KeyboardAvoidingView>
  );
}
