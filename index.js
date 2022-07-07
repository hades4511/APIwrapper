require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
FormData = require('form-data');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.post('', (req, res, next) => {
    const query = req.query
    console.log(query);
    res.json(query);
})

const sendRequest = (method, url, res, data={}) => {
    const formData = new FormData();
    console.log(data);
    for (const key in data){
        formData.append(key, data[key]);
    }
    console.log(formData);
    axios({
        method: method,
        url: url,
        data: formData,
        headers: formData.getHeaders(),
    })
    .then(response => {
        console.log(response.headers['content-type']);
        const apiResponse = response.data ? response.data : {success: true};
        if(response.headers['content-type'] !== 'application/json') {
            return res.send(apiResponse);
        }
        else {
            console.log(apiResponse);
            return res.json(apiResponse);
        }
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

app.post('/post', (req, res, next) => {
    console.log('POST URL');
    const { url, ...queryParams } = req.query
    return sendRequest('post', makeURL(req.query), res, queryParams);
});

app.get('/get', (req, res, next) => {
    console.log('GET URL');
    const { url, ...queryParams } = req.query
    return sendRequest('post', makeURL(req.query), res, queryParams);
});

app.post('/fpost', (req, res, next) => {
    console.log('fpost');
    // console.log(req);
});

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});
