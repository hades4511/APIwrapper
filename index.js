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

const sendRequest = (mode, url, res) => {
    if (mode === 3){
        return -1;
    }
    const axiosFunc = mode ? axios.post : axios.get;
    axiosFunc(url)
    .then(response => {
        console.log('printing response data');
        console.log(response.data);
        const apiResponse = response.data ? response.data : {success: true};
        res.json(apiResponse);
    })
    .catch(error => {
        if (error.response.status === 404){
            console.log(`sending ${mode + 1}`);
            const customRes = sendRequest(mode + 1, url, res);
            if (customRes === -1){
                res.json(error);
            }
        }
        else res.json(error);
    });
};

app.use('', (req, res, next) => {
    const { url, ...queryParams } = req.query
    const qs = new URLSearchParams(queryParams).toString();
    console.log(qs);
    console.log(`${url}?${qs}`)
    sendRequest(0, `${url}?${qs}`, res);
})

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});
