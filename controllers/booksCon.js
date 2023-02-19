const jwt = require('jsonwebtoken');
const { on } = require('../models/booksDB');
const booksDB = require('../models/booksDB');
const cl = require('../utils/logAlias');

const books_library = async (req, res) => {
    let isLogged = false;
    const isTokenValid = () => {
        const token = req.cookies.token;
        if (!token) {
            return;
        }
        try {
            const data = jwt.verify(token, process.env.TOKEN_SECRET);
            isLogged = true;
        } catch (error) {
            return;
        }
    };
    isTokenValid();
    //Main Query (Display and Search)
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || '';
        const completed = req.query.completed || '';
        if(completed=='True'){
            const books = await booksDB.find({
                $or: [
                    { completed: true, title: { $regex: search, $options: 'i' } },
                    { completed: true, author: { $regex: search, $options: 'i' } },
                ]
              })
              .limit(limit)
              .skip(page * limit);
        
            const total = await booksDB.countDocuments({
              title: { $regex: search, $options: 'i' }
            });
            res.render('library', { title: 'Library', books, search, page: page + 1, limit, total, isLogged, completed });
            }else if(completed=='False'){
                const books = await booksDB.find({
                    $or: [
                        { completed: false, title: { $regex: search, $options: 'i' } },
                        { completed: false, author: { $regex: search, $options: 'i' } },
                    ]
                  })
                  .limit(limit)
                  .skip(page * limit);
            
                const total = await booksDB.countDocuments({
                  title: { $regex: search, $options: 'i' }
                });
                res.render('library', { title: 'Library', books, search, page: page + 1, limit, total, isLogged, completed });
                } else {
                    const books = await booksDB.find({
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { author: { $regex: search, $options: 'i' } },
                        ]
                      })
                      .limit(limit)
                      .skip(page * limit);
                
                    const total = await booksDB.countDocuments({
                      title: { $regex: search, $options: 'i' }
                    });
                    res.render('library', { title: 'Library', books, search, page: page + 1, limit, total, isLogged, completed });
                    }
        
      } catch (error) {
        console.log(error);
      }
};

const books_view = (req,res) => {
    const id = req.params.id;
    booksDB.findById(id)
    .then((result) => {
        res.render('view', {books: result, title: "Book Detail"})
    })
    .catch(err => cl(err.message));
}

const books_add = (req, res) => {
    console.log(req.body);
    const book = new booksDB(req.body);
    book.save()
    .then(result => res.redirect('/library'))
    .catch(err => cl(err.message));
}

const books_edit = (req, res) => {
    const id = req.params.id;
    booksDB.findById(id)
    .then((result) => {
        res.render('edit', {book: result, title: "Book Detail"})
    })
    .catch(err => cl(err.message));
}

const books_toEdit = async (req, res) => {
    let id = req.params.id;

  let bookUpdate = await booksDB.findByIdAndUpdate(id, {
        _id: req.body.id,
        title: req.body.title,
        order: req.body.order,
        completed: req.body.completed,
        author: req.body.author,
        linkBookImage: req.body.linkBookImage
    })

    if(!bookUpdate){
    return res.status(404).send(`Book can't be updated`);
    }
    res.redirect('/library');
}

const books_delete = async (req, res) => {
    const id = req.params.id;
  const deleteBook = await  booksDB.findByIdAndDelete(id)
  if(!deleteBook){
    return res.status(404).send(`Book can't be deleted`);
  }
  res.redirect('/library');
}

module.exports = {
    books_library,
     books_view,
     books_edit,
     books_toEdit,
     books_delete,
     books_add
}