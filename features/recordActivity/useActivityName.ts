import { useEffect, useRef, useState } from 'react'
import { TextInput } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import generateActivityName from '../../util/generateActivityName'

import { ActivityState, changeActivityName } from './activitySlice'


export default function useActivityName() {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [hasEditedActivityName, setHasEditedActivityName] = useState(false)
  const nameInputRef = useRef<TextInput>(null)
  const setActivityName = (name: string) => dispatch(changeActivityName(name))
  const {
    activityName,
    activityType,
    isStarted,
  } = useSelector((state: { activity: ActivityState }) => ({
    activityName: state.activity.activity.name,
    activityType: state.activity.activity.activityType,
    isStarted: state.activity.isStarted,
  }))
  const [tempActivityName, setTempActivityName] = useState(activityName)

  useEffect(() => {
    if(!hasEditedActivityName) {
      setActivityName(generateActivityName(activityType))
    }
  }, [activityType])

  const startEditing = () => {
    setIsEditing(true)
    setTempActivityName(activityName)
    nameInputRef.current?.focus()
  }

  const acceptActivityName = () => {
    if(tempActivityName) {
      setHasEditedActivityName(true)
      setActivityName(tempActivityName)
    }
    setIsEditing(false)
  }

  const rejectActivityName = () => {
    setIsEditing(false)
  }

  return {
    acceptActivityName,
    activityName,
    isEditing,
    nameInputRef,
    rejectActivityName,
    setIsEditing,
    setTempActivityName,
    startEditing,
    tempActivityName,
  }
}
