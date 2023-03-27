import React, {useState} from "react";
import axios from "axios";
import {CSVLink} from "react-csv";
import './App.css'


function App() {

    //////////////////////////////
    const axiosIntance = axios.create({ baseURL: "http://0.000.000.00:8080/api" });

    const [choose,setChoose] = useState(true)
    const [generate,setGenerate] = useState(false)
    const [download,setDownload] = useState(false)
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(false)

    const [prompt, setPrompt] = useState([]);
    const [response, setResponse] = useState([]);
    const promptArr = []


    ////////////////////////////////
    const [file, setFile] = useState();
    const [array, setArray] = useState([]);
    const [headArray, setHeadArray] = useState([]);

    const hearObj = [
        {label: "topic", key: "topic"},
        {label: "ai_prompt", key: "ai_prompt"},
        {label: "article", key: "article"}
    ]


    const fileReader = new FileReader();

    const handleOnChange = (e) => {
        setFile(e.target.files[0]);
    };

    const csvReport = {
        data: array,
        headers: hearObj,
        filename: 'Articles.csv'
    };

    const csvFileToArray = string => {
        const topic = ["label", "key"]
        const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
        console.log(csvHeader)
        const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
        const headerArr = csvHeader.map((head) => {
            const objHead = topic.reduce((object1, h, index) => {
                object1[h] = head
                return object1
            }, {})
            return objHead
        })
        headerArr.push({label: "article", key: "article"})
        const array = csvRows.map((i, index) => {
            const values = i.split(",");
            promptArr[index] = values[1]
            const obj = csvHeader.reduce((object, header, index) => {
                object[header] = values[index];
                return object;
            }, {});
            return obj;
        });

        setPrompt(promptArr);
        setArray(array)
        setHeadArray(headerArr)

    };

    const handleOnSubmit = (e) => {
        e.preventDefault();

        if (file) {
            fileReader.onload = function (event) {
                const text = event.target.result;
                csvFileToArray(text);
            };

            fileReader.readAsText(file);
            setChoose(false)
            setGenerate(true)
        }


    };

    const handleClick = (e) => {
        e.preventDefault();
        console.log("promit",prompt)
        // Send a request to the server with the prompt
        setGenerate(false)
        setLoading(true)
        axiosIntance
            .post("/api/chat", {prompt})
            .then((res) => {
                // Update the response state with the server's response
                setResponse(res.data);
                array.map((blog, index) => {
                    blog.article = res.data[index]
                })
                console.log(res.data)
                console.log(array)
                setDownload(true)
                setLoading(false)

            })
            .catch((err) => {
                setLoading(false)
                setError(true);
            });


    };

    const handleClick1 = (e) => {
        e.preventDefault();

        // Send a request to the server with the prompt
        setGenerate(false)
        setLoading(true)
        axiosIntance
            .post("/api/web", {prompt})
            .then((res) => {
                // Update the response state with the server's response
                setResponse(res.data);
                array.map((blog, index) => {
                    blog.article = res.data[index]
                })
                console.log(res.data)
                console.log(array)
                setDownload(true)
                setLoading(false)

            })
            .catch((err) => {
                setLoading(false)
                setError(true);
            });


    };



    const headerKeys = Object.keys(Object.assign({}, ...array));

    return (
        <div className="App">
            <h1>Automatic Articles Generator</h1>

            {choose?<form>
                <p>Choose the File First and Click Upload</p>
                <label htmlFor="images" className="drop-container">
                    <span className="drop-title">Drop files here</span>
                    or
                    <input type={"file"}
                           id={"csvFileInput"}
                           accept={".csv"}
                           onChange={handleOnChange} required/>
                </label>
                <div className="upload_container">
                    <button
                        onClick={(e) => {
                            handleOnSubmit(e);
                        }}

                        className="upload"
                    >
                        Upload
                    </button>
                </div>


            </form>:""}
            {generate?<div className="generate">
                <p>The File has Uploaded. Select Where to Generate Articles</p>
                <button onClick={(e) => handleClick(e)}>ChatGPT</button>
                <button onClick={(e) => handleClick1(e)}>WriteSonic</button>

            </div>:""}

            {loading? <div className="ring_container"><div className="ring">Loading...
                <span></span>
            </div></div>:""}
            {error?
                <div style={{border: "1px solid darkred", background: "salmon" ,padding:20,fontSize:25}}>
                    <i>&#9888;</i>Something went wrong. Please Try Again.
                </div>:"" }

            {/*<div>*/}
            {/*    {response.map((item) => (*/}
            {/*        <p>{item}</p>*/}
            {/*    ))}*/}
            {/*</div>*/}

            {download?
                <div className="download_container">
                    <p>All Articles have Generated.You can Download the File now.</p>
                <CSVLink {...csvReport}><button>Download</button></CSVLink>
                </div>:""}


        </div>
    );
}

export default App;