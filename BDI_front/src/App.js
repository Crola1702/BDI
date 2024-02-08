import './App.css';
import React from "react";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { IntlProvider } from "react-intl";
import localeEn from "./locales/en.json";
import localeEs from "./locales/es.json";

import { BrowserRouter, Routes, Route} from "react-router-dom";

import YemboNavbar from "./components/YemboNavbar";
import Posts from "./components/Posts";
import LoginPage from "./components/auth/LoginPage";
import CreatePost from "./components/Forms/CreatePost";
import Post from "./components/Post";
import Filters from "./components/Filters";
import EditPost from "./components/Forms/EditPost";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "react-bootstrap";
import { useState } from "react";
import UserPosts from './components/UserPosts';

function App() {

  const userLocale = navigator.language || navigator.userLanguage;

  const [price, setPrice] = useState(200000000);
  const [minPrice, setMinPrice] = useState(1000000);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [tags, setTags] = useState([]);
  const [contractType, setContractType] = useState('All');

  const handleChange = (event) => {
      setPrice(event.target.value);
  }

  const handleFilter = (characteristics, contractType) => {
    setTags(characteristics.split(',').map((characteristic) => characteristic.trim()));
    setContractType(contractType);
    // Perform further actions or update state based on the values
  };

  const messagesMap = {
    en: localeEn,
    es: localeEs,
  };

  return (
    <IntlProvider
    locale={userLocale}
    messages={messagesMap[userLocale.slice(0, 2)]}
  >
    <BrowserRouter>
      <YemboNavbar />
      <Container>
        <Routes>
          <Route path="/" element={<React.Fragment> 
            <Filters price={price} handleChange={handleChange} min={minPrice} max={maxPrice} onFilter={handleFilter}/>
            <Posts max={price} setMax={setMaxPrice} setMin={setMinPrice} filterContract={contractType} filterTags={tags}/>
          </React.Fragment>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/profile" element={<UserPosts />} />
          <Route exact path="/post/:id" element={<Post/>} />
          <Route exact path="users/:userId/posts/:postId/edit" element={<EditPost />} />
          
  
        </Routes>
        <ToastContainer />
      </Container>
    </BrowserRouter>
  </IntlProvider>
  );
}

export default App;
