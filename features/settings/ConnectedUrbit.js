import { StyleSheet, Text, View } from 'react-native'


export default ConnectedUrbit = ({ ship, shipUrl }) => {
  const initial = ship.replace('~', '')[0]
  const isMoon = ship.split('-').length > 1
  
  return (
    <View style={styles.profile}>
      <View style={styles.profileImageContainer}>
        <Text style={styles.profileImageText}>{initial}</Text>
      </View>
      <View style={styles.profileContentContainer}>
        <Text style={isMoon ? styles.moonShipText : styles.shipText}>{ship}</Text>
        <Text style={{}}>{shipUrl}</Text>
        <Text style={{}}>Connected</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  profileContentContainer: {
    display: 'flex',
    flexGrow: 1,
    marginLeft: 15,
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    borderRadius: 60 / 2,
    backgroundColor: 'orange',
  },
  profileImageText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 15,
  },
  profile: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 10,
    paddingTop: 10,
    marginRight: 20,
  },
  shipText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  moonShipText: {
    fontSize: 20,
    fontWeight: 'bold',
  }
})


