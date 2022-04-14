import { AppContext } from '../app/App';
import { useContext } from 'react';

export function useAppContext() {
  return useContext(AppContext);
}
