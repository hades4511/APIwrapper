require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
// FormData = require('form-data');
const FormData = require('form-urlencoded');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.post('', (req, res, next) => {
    const query = req.query
    console.log(query);
    res.json(query);
})

const sendRequest = (method, url, res, data={}) => {
    const formData = FormData(data);
    // const d2 = {
    //     team_id: '65cd9b10-bc98-4938-8099-be8809e629fd',
    //     secret: 'acb6042c-3f3f-428a-a2f3-711db5b58277',
    //     foreign_id: 'eh192',
    //     audio_url: 'https://g4smarketing.com/wp-content/uploads/2020/12/Voice-Drop-1-Paul-Rue-Car.mp3',
    //     audio_type: 'mp3',
    //     phone_number: '++14802701262',
    //     caller_id: '+17703432956'
    // };
    console.log(data);
    // for (const key in data){
    //     formData.append(key, data[key]);
    // }
    console.log(formData);
    axios({
        method: method,
        url: 'https://webhook.site/34d78eb4-e2dc-40d3-bfcc-3cf431afceea',
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
    console.log(req.headers);
    res.json({success: true});
});

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});
