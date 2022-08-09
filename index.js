require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-urlencoded');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const sendRequest = (url, res, data={}) => {
    const formData = FormData(data);
    console.log(data);
    console.log(formData);
    console.log(url);
    axios({
        method: 'post',
        url: url,
        data: formData,
    })
    .then(response => {
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

const splitParams = queryParams => {
    const getParams = {};
    for (let key of Object.keys(queryParams)){
        console.log(key);
        let splitKey = key.split('_')
        if(splitKey[0] === 'param' && splitKey.length > 1){
            getParams[splitKey[1]] = queryParams[key];
            delete queryParams[key]
        }
    }
    return getParams;
}

app.post('/post', (req, res, next) => {
    console.log('POST URL');
    const { url, ...queryParams } = req.query;
    const getParams = splitParams(queryParams);
    const updateURL = `${url}?${new URLSearchParams(getParams).toString()}`;
    return sendRequest(updateURL, res, queryParams);
});

app.get('/get', (req, res, next) => {
    console.log('GET URL');
    const { url, ...queryParams } = req.query;
    const getParams = splitParams(queryParams);
    const updateURL = `${url}?${new URLSearchParams(getParams).toString()}`;
    return sendRequest(updateURL, res, queryParams);
});

app.post('/lead/post', (req, res, next) => {
    console.log('Lead POST URL');
    console.log(req.body.customData);
    const { url, ...queryParams } = req.body.customData;
    const getParams = splitParams(queryParams);
    const updateURL = `${url}?${new URLSearchParams(getParams).toString()}`;
    return sendRequest(updateURL, res, queryParams);
});

app.get('/lead/get', (req, res, next) => {
    console.log('GET URL');
    const { url, ...queryParams } = req.query.lead[0];
    const getParams = splitParams(queryParams);
    const updateURL = `${url}?${new URLSearchParams(getParams).toString()}`;
    return sendRequest(updateURL, res, queryParams);
});

app.get('/test/get', (req, res, next) => {
    console.log('GET URL');
    const { url, ...queryParams } = req.query;
    const getParams = splitParams(queryParams);
    console.log(getParams);
    console.log(queryParams);
    console.log(new URLSearchParams(getParams).toString())
    return;
});

app.post('/test/post', (req, res, next) => {
    console.log('POST URL');
    const { url, ...queryParams } = req.query;
    const getParams = splitParams(queryParams);
    console.log(getParams);
    console.log(getParams);
    return
});

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});
