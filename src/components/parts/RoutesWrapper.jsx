import { Link, Outlet } from 'react-router-dom';
import { createContext } from 'react';
import { getTranslationObj } from '../../utils/translation.js';

export const TranslationContext = createContext();

export function RoutesWrapper() {
  return (
    <TranslationContext.Provider value={getTranslationObj()}>
      <Outlet />
      <footer>
        <a target='_blank' href='https://github.com/ts213/mboard/' rel="noreferrer">
          mboard
        </a>
        <Link to=''>About</Link>
      </footer>
    </TranslationContext.Provider>
  );
}
