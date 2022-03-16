const fs = require("fs");
const path = require("path");
const express = require("express");
const notes = require("./db/db.json");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
const PORT = process.env.PORT || 3002;


function addNewNote(body, notesArr) {
    const note = body;
    note.id = Math.floor(Math.random() * 999);
    notesArr.push(note);
    fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(notesArr)
    );
    return note;
}


function writeNote(noteObj) {


    const notesArr = function () {
        fs.readFileSync(
            path.join(__dirname, "./db/db.json"),
            "utf-8",
            function (error, data) {
                console.log(data);
                return data;
            }
        );
    };
    const newArr = notesArr.filter((item) => {
        return item.id != noteObj;
    });
    fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(newArr)
    );
}



app.get("/api/notes", (req, res) => {
    let response = notes;
    fs.readFileSync(
        path.join(__dirname, "./db/db.json"),
        "utf-8",
        function (error, data) {
            console.log(data);
            res.json({ data: data });
        }
    );
    res.json(response);
});

app.get("/api/note/:id", (req, res) => {
    const note = req.body;
    if (!res) {
        res.status(500).json({ error: err.message });
        return;
    }
    res.json(note);
});
app.post("/api/notes", (req, res) => {
    const note = addNewNote(req.body, notes);
    res.json(note);
});



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.listen(PORT, () => {
    console.log("Server active");
});