import { useRef, useState } from 'react'
import { TextInput } from 'react-native'


export default function useAccessCodeEntry() {
  const [showPassword, setShowPassword] = useState(false)
  const [accessCode, setAccessCode] = useState('')

  const urlInputRef = useRef<TextInput>(null)


  return {
    accessCode,
    showPassword,
    setAccessCode,
    setShowPassword,
  }
}
