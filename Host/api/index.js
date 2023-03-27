const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const sdk = require('api')('@writesonic/v2.2#43xnsflcadmm1b');

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: "chat gpt api",
});
const openai = new OpenAIApi(configuration);

// Set up the server
const app = express();
app.use(bodyParser.json());
app.use(cors())

// Set up the ChatGPT endpoint
app.post("/api/chat", async (req, res) => {
    // Get the prompt from the request
    const { prompt } = req.body;
    const array = [];
    // Generate a response with ChatGPT
    for (let i=0;i<prompt.length-1;i++){
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt[i],
            max_tokens:4000,

        });
        array[i] = completion.data.choices[0].text;

    }
    res.send(array);

});



app.post("/api/web",async (req,res)=>{
    // Get the prompt from the request
    const { prompt } = req.body;
    const array = [];
    // Generate a response with ChatGPT
    for (let i=0;i<prompt.length-1;i++){
    sdk.auth('write sonic api');
    const completion = await sdk.ansMyQues_V2BusinessContentAnsMyQues_post({engine: 'premium',question: prompt[i]}, {num_copies: '1'})
        console.log(i,completion.data[0].text)
        array[i] = completion.data[0].text

    }
    res.send(array);

})

// Start the server
const port = 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});