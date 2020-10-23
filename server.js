require('dotenv').config()
const PORT = process.env.PORT || 8000;


const cors = require('cors');
const { response } = require('express');
const express = require('express')
const morgan = require('morgan')
const movieList = require('./movieList.json')


const app = express()

const morganSetting= process.env.NODE_ENV === "production" ? "tiny" : "dev";

app.use(morgan(morganSetting))
app.use(cors())

app.use(function validateBearerToken(req,res,next){
    const bearerToken = req.get('Authorization')
    const api_TOKEN = process.env.api_TOKEN;

    if(!bearerToken || bearerToken.split(" ")[1] !== api_TOKEN){
        res.status(401).json({message: "Sorry you are unauthorized!"} )
    }
    next()

})

function handleMovieResults(req,res){
    let response = movieList;


    if(req.query.title){
        response = response.filter(movie => {
            return movie.film_title.toLowerCase().includes(req.query.title.toLowerCase())
        })
    }

    if(req.query.genre){
        response = response.filter(movie => {
            return movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        })
    }
    if(req.query.country){
        response = response.filter(movie => {
            return movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        })
    }
    if(req.query.avg_vote){
            response = response.filter(movie => {
                
                return movie.avg_vote >= parseFloat(req.query.avg_vote)
            })
    }

    res.json(response);
}

app.get('/movie', handleMovieResults)



app.use((req, res) => {
  res.send('Hello, world!')
})


app.use((error, req, res, next) => {
    let response;
    if(process.env.NODE_ENV === 'production'){
        response = {error: {message: 'server error'}}
    }
    else {
        response = {error};
    }
    res.status(500).json(response)
})


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})