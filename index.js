require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true} ));
app.use(cors());

app.post('', (req, res, next) => {
    const query = req.query
    console.log(query);
    res.json(query);
})

const sendRequest = (axiosFunc, url, res, data=null) => {
    console.log(data);
    axiosFunc(url, data)
    .then(response => {
        console.log('printing response data');
        console.log(response.data);
        console.log(response.headers['content-type']);
        const apiResponse = response.data ? response.data : {success: true};
        if(!(response.headers['content-type'] === 'application/json')) {
            return res.send(apiResponse);
        }
        else return res.json(apiResponse);
    })
    .catch(error => {
        console.log(error);
        res.json(error);
    });
};

const makeURL = (query) => {
    const { url, ...queryParams } = query
    const qs = new URLSearchParams(queryParams).toString();
    console.log(qs);
    console.log(`${url}?${qs}`);
    return `${url}?${qs}`;
};

app.get('/post', (req, res, next) => {
    console.log('Force POST');
    const { url, ...queryParams } = req.query
    return sendRequest(axios.post, makeURL(req.query), res, queryParams);
});

app.get('', (req, res, next) => {
    return sendRequest(axios.get, makeURL(req.query), res);
});

app.post('', (req, res, next) => {
    const { url, ...queryParams } = req.query
    return sendRequest(axios.post, makeURL(req.query), res, queryParams);
})

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});
