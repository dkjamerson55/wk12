
// class for holding array of books
class Genre {
    constructor (name){
        this.name = name; // name of genre
        this.books = []; // array of books within genre
    }

    // method for adding new books to the genre
    addBook(title, author) {
        this.books.push(new Book(title, author));
    }
}

//class for defining a book
class Book {
    constructor (title, author) {
        this.title = title; //title of book
        this.author = author; // author of book
    }
}

// class for establishing methods to be used and call for api database
class GenreAdd {
    static url= 'http://localhost:3000/Library'; // local api

    //method for returning url
    static getAllGenres (){
        return $.get(this.url);
    }

    //method to return url & genre id using jquery selector
    static getGenre(id) {
        return $.get(this.url, genre);
    }

    //method for creating new genre and returning the new genre value concatenated w/ id
    static createGenre(genre) {
        return $.get(this.url + `/${id}`);
    } 

    //method for 
    static updateGenre(genre) {
        return $.ajax({
            url: this.url + `${genre.id}`,
            dataType: 'json', 
            data: JSON.stringify(genre), 
            contentType: 'application/json',
            type: 'PUT'
        });
    }
    
    //method that will target a specific genre id to delete from api
    static deleteGenre(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

//class which all methods formerly called will be created/defined
class DOMManager {
    static genres;

    //call method for getting all genres
    static getAllGenres() {
        GenreAdd.getAllGenres().then(genres => this.render(genres))
    }

    //mehtod for deleting genre
    static deleteGenre(id) {
        GenreAdd.deleteGenre(id)
        .then(() => {
            return GenreAdd.getAllGenres();
        })
        .then((genres) => this.render(genres));
    }

    //method for creating new genre
    static createGenre(name) {
        GenreAdd.createGenre(new Genre(name))
        .then(() => {
            return GenreAdd.getAllGenres();
        })
        .then((genres) => this.render(genres));
    }

    //method for adding new book to array
    static addBook(id) {
        for(let genre of this.genres) {
            if (genre._id == id) {
                genre.books.push(new Book($(`#${genre._id}-book-title`).val(), $(`#${genre._id}-book-author`).val()));
                GenreAdd.updateGenre(genre)
                    .then(() => {
                        return GenreAdd.getAllGenres();
                    })
                    .then((genres) => this.render(genres));
            }
        }
    }

    static deleteBook (genreId, bookId) {
        for (let genre of this.genre) {
            if (genre._id == genreId) {
                for (let book of genre.books) {
                    if (book._id == bookId) {
                        genre.books.splice(genre.books.indexOf(book), 1);
                        GenreAdd.updateGenre(genre)
                        .then(() => {
                            return GenreAdd.getAllGenres();
                        })
                        .then((genres) => this.render(genres));
                    }
                }
            }
        }
    }

    //method for rendering genres
    static render(genres) {
        this.genre = genres;
        $('#app').empty();
        for(let genre of genres) {
            $('#app').prepend(
                `<div id="$(genre._id)" class="card m-4">
                    <div class= "card-header">
                        <h2>${genre.name}</h2>
                        <button class= "btn btn-danger mb-5" onclick= "DOMManager.deleteGenre('${genre._id}')">Delete Genre</button>
                    </div>
                    
                    <div class= "card-body">
                        <div class= "card">
                            <div class= "row m-3">
                                <div class= "col-sm">
                                    <input type= "text" id= "${genre._id}-book-title" class= "form-control" placeholder= "Book Title">
                                </div>

                                <div class= "col-sm">
                                    <input type= "text" id= "${genre._id}-book-author" class= "form-control" placeholder= "Book Author">
                                </div>
                            </div>
                            <button id="${genre._id}-new-book" onclick= "DOMManager.addBook('${genre._id}'): class="btn btn-warning form-control">Add Book</button>
                        </div>
                    </div>
                </div><br>`
            );
            for(let book of genre.books) {
                $(`${genre._id}`).find('.card-body').append(
                    `<p>
                        <span id="title-${book._id}"><strong>Title: </strong> ${book.title}</span>
                        <span id= "author-${book._id}"><strong>Author: </strong> ${book.author}</span>
                        <button class= "btn btn-danger" onclick= "DOMManager.deleteBook('${genre._id})', '${book._id}')">Delete Book</button>`
                )
            }
        }
    }
}

console.log(genre);


DOMManager.getAllGenres();