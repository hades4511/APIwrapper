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
    axios({
        method: 'post',
        url: url,
        data: formData,
        // headers: { ...formData.getHeaders() },
        // headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
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

app.post('/post', (req, res, next) => {
    console.log('POST URL');
    const { url, ...queryParams } = req.query;
    return sendRequest(url, res, queryParams);
});

app.get('/get', (req, res, next) => {
    console.log('GET URL');
    const { url, ...queryParams } = req.query;
    return sendRequest(url, res, queryParams);
});

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});
