import React, { useEffect, useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import axiosWithAuth from '../axios'
import Protected from './Protected'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'
const initialFormValues = { title: '', text: '', topic: '' }

export default function App() {
  // ✨ MVP can be achieved with these states
  const [values, setValues] = useState(initialFormValues)
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)


  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => {
    navigate('/');
    /* ✨ implement */
  }
  const redirectToArticles = () => {
navigate("articles")

    /* ✨ implement */
  }

  const logout = () => {
    localStorage.clear()
    setMessage("Goodbye")
    redirectToLogin()
    // ✨ implement
    // + If a token is in local storage it should be removed,
    // + and a message saying "Goodbye!" should be set in its proper state.
    // + In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = ({ username, password }) => {
    // ✨ implement
    setMessage("")
    setSpinnerOn(true)
    // We should flush the message state, turn on the spinner
    axios.post('http://localhost:9000/api/login', { username, password })
      .then(res => {
        localStorage.setItem("token", res.data.token);
        setSpinnerOn(false)
        setMessage(res.data.message);
        navigate('/articles')

      })
      .catch(err => {
        setMessage(err.repsonse.data.message);
        setSpinnerOn(false);
        redirectToLogin()
      })
    // + and launch a request to the proper endpoint.
    // + On success, we should set the token to local storage in a 'token' key,
    // + put the server success message in its proper state, and redirect
    // + to the Articles screen. Don't forget to turn off the spinner!
  }


  const getArticles = () => {
    // ✨ implement
    // setMessage("")
    setSpinnerOn(true)
    // const token = localStorage.getItem("token");
    axiosWithAuth().get('http://localhost:9000/api/articles')
      .then(res => {
        setArticles(res.data.articles);
        setMessage(res.data.message);
        setSpinnerOn(false);
        // console.log("RENDERED")
        // console.log(res.data.articles)
      })
      .catch(err => {
        console.log(err);
        setSpinnerOn(false);
        setMessage("Ouch: jwt expired")
        redirectToLogin()
      })


    // + We should flush the message state, turn on the spinner
    // + and launch an authenticated request to the proper endpoint.
    // THIS IS NOT WORKING!!! On success, we should set the articles in their proper state and
    // + put the server success message in its proper state.
    // + If something goes wrong, check the status of the response:
    // + if it's a 401 the token might have gone bad, and we should redirect to login.
    // + Don't forget to turn off the spinner!
  }

  const postArticle = article => {
    // ✨ implementconst 
    // const token = localStorage.getItem("token");
    // axios.create({ headers: { authorization: token } })
    axiosWithAuth().post('http://localhost:9000/api/articles', article)
      .then(res => {
        setMessage(res.data.message)
        setArticles([...articles, res.data.article])
      })
      .catch(err=>{
        console.log(err)
      })


      
    // + The flow is very similar to the `getArticles` function.
    // + You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }
  const updateArticle = (art, values) => {
    // ✨ implement
    console.log(values)

    axiosWithAuth().put(`http://localhost:9000/api/articles/${art}`, values)
      .then(res => {
        setMessage(res.data.message);
        setValues(initialFormValues);
        getArticles()      
})
      .catch(err => console.log(err))




    // const token = localStorage.getItem("token")
    // axios.create({headers:{authorization: token}})
    // .put(`http://localhost:9000/api/articles/${article_id}`, { "title": art.title, "text": art.text, "topic": art.topic })
    // .then(res => {
    //   setMessage(res.data.message);
    //   setArticles(articles)
    // })
    // .catch(err => console.log(err))
    // You got this!
  }

  const deleteArticle = article_id => {
    // ✨ implement 
    const token = localStorage.getItem("token");
    axios.create({ headers: { authorization: token } })
      .delete(`http://localhost:9000/api/articles/${article_id}`)
      .then(res => {
        setMessage(res.data.message);
        console.log(article_id);
        const index = articles.findIndex((article) => article.article_id === article_id)
        const copyOfArticles = [...articles]
        copyOfArticles.splice(index, 1)
        setArticles(copyOfArticles)
      })
      .catch(err => console.log(err))
  }

  //this deletearticle works! 

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <Protected
            getArticles={getArticles} updateArticle={updateArticle} postArticle={postArticle} articles={articles} setCurrentArticleId={setCurrentArticleId} deleteArticle={deleteArticle} currentArticleId={currentArticleId} values={values} setValues={setValues} setMessage={setMessage}/>
              
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
