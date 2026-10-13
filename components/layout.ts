import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* Settings for fitting the games into a bigger app.

   Running on its own (Expo Go with this project): leave everything as it is.

   Merged into the main app, which already has its own header and tab bar:
   1. set EMBEDDED to true so the games stop adding their own space at the top and bottom
   2. set GAMES_MENU to the route of the Games screen, so Exit lands there
   3. set SORT_ROUTE and CATCH_ROUTE to where the two game screens live */
export const EMBEDDED = false;
export const GAMES_MENU = '/';
export const SORT_ROUTE = '/sort';
export const CATCH_ROUTE = '/catch';

export function useBottomInset() {
  const insets = useSafeAreaInsets();
  return EMBEDDED ? 0 : insets.bottom;
}
