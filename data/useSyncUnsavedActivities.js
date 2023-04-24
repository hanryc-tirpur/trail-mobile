import { useDispatch } from 'react-redux'
import { pokeRequest } from './urbitApiSaga'



export default function useSyncUnsavedActivities() {
  const dispatch = useDispatch()

  return () => dispatch(pokeRequest({
    app: 'trail',
    mark: 'trail-action',
  }))
}
