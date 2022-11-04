import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

import LoginPage from "./modules/auth/components/LoginPage";
import SignupPage from "./modules/auth/components/SignupPage";
import AppHeader from './layouts/AppHeader';
import AppFooter from './layouts/AppFooter';
// import AppModals from './layouts/AppModals';
import StoreProvider from "./store";

function App() {
  return (
    <Router>
      <StoreProvider>
        <AppHeader />
        <div>
          <Routes>
            <Route path="/sign-in" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignupPage />} />
          </Routes>
        </div>
        <AppFooter />
        {/* <AppModals /> */}
      </StoreProvider>
    </Router>
  );
}

export default App;
