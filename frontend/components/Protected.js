import { useEffect } from 'react'
import { Link, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import React from 'react'
import ArticleForm from './ArticleForm'
import Articles from './Articles'

export default function Protected(props){
    const {getArticles, updateArticle, postArticle, articles, setCurrentArticleId, deleteArticle, currentArticleId, values, setValues, setMessage} = props

    if (!localStorage.getItem('token')) {
        const navigate = useNavigate()
        useEffect(()=>{
            navigate('/')
        },[]) 
    }
    else {
    
        return (
            <>
                <ArticleForm
                    updateArticle={updateArticle}
                    deleteArticle={deleteArticle}
                    postArticle={postArticle}
                    articles={articles}
                    setCurrentArticleId={setCurrentArticleId} currentArticleId={currentArticleId}
                    values={values}
                    setValues={setValues} />
                <Articles
                    setCurrentArticleId={setCurrentArticleId} getArticles={getArticles}
                    currentArticleId={currentArticleId} deleteArticle={deleteArticle}
                    articles={articles}
                    updateArticle={updateArticle}
                    values={values}
                    setMessage={setMessage} 
                    setValues={setValues}/>
            </>
        )
    
    }


    
}


