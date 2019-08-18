const express = require('express')
const apiRouter = express.Router()
const bodyParser = require('body-parser')
const app = express()

const livros = require("./livros.json")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

apiRouter.get('/', (req, res) => {
    res.json({ message: 'Api criada' })
})

apiRouter.route('/livros').get(function (req, res) {
    let elm = {
        "totalElements": livros.length
    }
    livros.push(elm)
    res.send(livros)
})

apiRouter.route('/p').get(function (req, res) {
    if(req.query.find) {
        let find = req.query.find.toLowerCase()
        let values = []
        livros.forEach(element => {
            let isbnValue = element['isbn'].toString().toLowerCase()
            let authorValue = element['autor'].toLowerCase()
            let titleValue = element['livro'].toLowerCase()
            if(isbnValue.includes(find) || authorValue.includes(find) || titleValue.includes(find)) {
                values.push(element)
            }
        });
        let elm = {
            "totalElements": values.length
        }
        values.push(elm)
        res.send(values)
    }
})

apiRouter.route('/filter').post(function (req, res) {
    if(req.body) {
        let datIni = req.body.datIni
        let datFim = req.body.datFim
        let values = []
        livros.forEach(element => {
            let year = element['ano'].toString()
            if(year >= datIni && year <= datFim) {
                values.push(element)
            }
        });
        let elm = {
            "totalElements": values.length
        }
        values.push(elm)
        res.send(values)
    }
})


apiRouter.route('/details/:id').get(function (req, res) {
    if(req.params) {
        let id = req.params.id
        livros.forEach(element => {
            let idBook = element['id'].toString()
            if(id == idBook) {
                res.send(element)
            }
        });
    }
})
app.use('/api', apiRouter)

app.listen(3000)