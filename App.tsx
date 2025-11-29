import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Practice } from './pages/Practice';
import { Flashcards } from './pages/Flashcards';
import { Results } from './pages/Results';
import { History } from './pages/History';
import { Stats } from './pages/Stats';
import { Achievements } from './pages/Achievements';
import { Bookmarks } from './pages/Bookmarks';

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="practice" element={<Practice />} />
            <Route path="flashcards" element={<Flashcards />} />
            <Route path="results" element={<Results />} />
            <Route path="history" element={<History />} />
            <Route path="stats" element={<Stats />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="bookmarks" element={<Bookmarks />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;