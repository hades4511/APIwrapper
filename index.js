require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({
    extended: true
  })
);
app.use(cors());

app.post('', (req, res, next) => {
    const query = req.query
    console.log(query);
    res.json(query);
})

app.use('', (req, res, next) => {
    const { url, queryParams } = req.query
    const qs = new URLSearchParams(queryParams).toString();
    console.log(qs);
    axios.post(`${url}?${qs}`)
    .then(response => {
        console.log(response.data);
        const apiResponse = response.data ? response.data : {success: true};
        res.json();
    })
    .catch(error => {
        console.log(error);
    });
})

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});
