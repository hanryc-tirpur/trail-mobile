import { useRef, useState } from 'react'
import { TextInput } from 'react-native'


export default function useShipEntry() {
  const [protocol, setProtocol] = useState(Protocol.Https)
  const [shipUrlWithoutProtocol, setShipUrlWithoutProtocol] = useState<string | null>(null)

  const urlInputRef = useRef<TextInput>(null)
  const deselectedProtocol = protocol === Protocol.Http ? Protocol.Https : Protocol.Http
  const shipUrl = `${protocol}${shipUrlWithoutProtocol === null ? '' : shipUrlWithoutProtocol}`


  return {
    deselectedProtocol, 
    selectedProtocol: protocol,
    shipUrl,
    urlInputRef,

    setSelectedProtocol() {
      setProtocol(deselectedProtocol)
      urlInputRef?.current?.focus() 
    },
    setShipUrl(url: string) {
      setShipUrlWithoutProtocol(url.replace(protocol, ''))
    },
  }
}

export enum Protocol {
  Http = 'http://',
  Https = 'https://',
}
