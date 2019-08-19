const express = require('express')
const apiRouter = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

const livros = require("./livros.json")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

apiRouter.get('/', (req, res) => {
    res.json({ message: 'Api criada' })
})

apiRouter.route('/livros').get(function (req, res) {
    res.send(livros)
})


apiRouter.route('/filter').post(function (req, res) {
    if(req.body) {
        let datIni = req.body.datIni != null ? req.body.datIni : null
        let datFim = req.body.datFim != null ? req.body.datFim : null
        let search = req.body.search != null ? req.body.search : null
        let values = []
        livros.forEach(element => {
            let year = element['ano'].toString()
            if(datIni != null && datFim != null && year >= datIni && year <= datFim) {
                values.push(element)
            }
        });
        if(values.length > 0) {
            values.map(function(e) {
                let arr = getValuesFromSearch(e, search);
                if(arr != undefined) {
                    values = []
                    values.push(arr)
                }
            })
        } else {
            livros.forEach(e => {
                values.push(getValuesFromSearch(e, search))
            })
        }
        
        res.send(removeUndefinedValues(values))
    }
})

function removeUndefinedValues(element) {
    return element.filter(function (el) {
        return el != null;
      });
}
function getValuesFromSearch(e, search) {
    if(search != null) {
        let isbnValue = e['isbn'].toString().toLowerCase()
        let authorValue = e['autor'].toLowerCase()
        let titleValue = e['livro'].toLowerCase()
        if(isbnValue.includes(search) || authorValue.includes(search.toLowerCase()) || titleValue.includes(search.toLowerCase())) {
            return e;
        }
    }
}
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