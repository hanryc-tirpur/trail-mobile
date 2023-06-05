import { StateCreator, create } from 'zustand'


interface ConnectionProcessStore {
  acceptedUrl: string | null,
  authCookie: string | null,
  isConnected: boolean,
  isValidatingLogin: boolean,
  isValidatingUrl: boolean,
  loginProblem: string | null,
  ship: string | null,
  urlProblem: string | null,
  actions: {
    acceptUrl: (url: string) => void,
    attemptLogin: (url: string) => Promise<void>,
    validateUrl: (url: string) => Promise<void>,
  }
}

const connectionProcessStore: StateCreator<ConnectionProcessStore> = (set, get) => ({
  acceptedUrl: null,
  authCookie: null,
  isConnected: false,
  isValidatingLogin: false,
  isValidatingUrl: false,
  loginProblem: null,
  ship: null,
  urlProblem: null,
  actions: {
    acceptUrl(url) {
      set({
        acceptedUrl: url,
      })
    },
    async attemptLogin(accessCode) {
      set({
        isValidatingLogin: true,
        loginProblem: null,
      })
      
      const accessCodePattern = /^((?:[a-z]{6}-){3}(?:[a-z]{6}))$/i
  
      if (!accessCode.match(accessCodePattern)) {
        return set({
          isValidatingLogin: false,
          loginProblem: 'Please enter a valid access key.',
        })
      }

      const formBody = `${encodeURIComponent('password')}=${encodeURIComponent(accessCode)}`
      const { acceptedUrl } = get()
        
      try {
        const res = await fetch(`${acceptedUrl}/~/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencodedcharset=UTF-8'
          },
          body: formBody
        })

        const authCookie = res.headers.get('set-cookie')
        if(authCookie?.includes('urbauth-~')) {
          return set({
            isConnected: true,
            isValidatingLogin: false,
          })
        }
        
        return set({
          isValidatingLogin: false,
          loginProblem: 'Please enter a valid access key.',
        })
      }
      catch (ex) {
        console.error(ex)
        return set({
          isValidatingUrl: false,
          urlProblem: 'Please ensure your ship is accessible and try again.',
        })
      }
    },
    removeUrl() {
      set({
        acceptedUrl: null,
        ship: null,
      })
    },
    async validateUrl(url) {
      set({
        isValidatingUrl: true,
        urlProblem: null,
      })
      
      const leadingHttpRegex = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/i
      const formattedUrl = (url.endsWith("/") ? url.slice(0, url.length - 1) : url).replace('/apps/escape', '')
    
      if (!formattedUrl.match(leadingHttpRegex)) {
        return set({
          isValidatingUrl: false,
          urlProblem: 'Please enter a valid ship URL.',
        })
      } 

      try {
        const res = await fetch(formattedUrl)
        const authCookie = res.headers.get('set-cookie')
        if(authCookie?.includes('urbauth-~')) {
          const SHIP_COOKIE_REGEX = /(~)[a-z\-]+?(\=)/
          const getShipFromCookie = (cookie: string) => {
            const matches = cookie.match(SHIP_COOKIE_REGEX)
            return matches && matches[0].slice(0, -1)
          }
          // TODO: handle expired auth or determine if auth has already expired
          const ship = getShipFromCookie(authCookie)
          return set({
            acceptedUrl: formattedUrl,
            authCookie,
            isValidatingUrl: false,
            ship,
          })
        }
        
        const html = await res.text()
        if(html) {
          const stringMatch = html.match(/<input value="~.*?" disabled="true"/i)
          const ship = stringMatch && stringMatch[0]?.slice(14, -17)
          if (ship) {
            set({
              acceptedUrl: formattedUrl,
              isValidatingUrl: false,
              ship, 
            })
          } else {
            set({
              acceptedUrl: formattedUrl,
              isValidatingUrl: false,
              urlProblem: 'Could not determine the ship name from this url. Please try another.', 
            })
          }
        }
      } catch(ex) {
        console.error(ex)
        return set({
          isValidatingUrl: false,
          urlProblem: 'Please ensure your ship is accessible and try again.',
        })
      }
    },
  }
})

const useConnectionProcessStore = create(connectionProcessStore)

export const useConnectionProcessActions = () => useConnectionProcessStore(state => state.actions)
export const useConnectionProcessConnection = () => useConnectionProcessStore(state => ({
  acceptedUrl: state.acceptedUrl,
  authCookie: state.authCookie,
  isConnected: state.isConnected,
  ship: state.ship,
}))
export const useConnectionProcessUrl = () => useConnectionProcessStore(state => ({
  acceptedUrl: state.acceptedUrl,
  isValidatingUrl: state.isValidatingUrl,
  ship: state.ship,
  urlProblem: state.urlProblem,
}))

