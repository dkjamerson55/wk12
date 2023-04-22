
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
    static url= 'https://64412ead792fe886a8a09b3d.mockapi.io/wk12API/Genre'; // local api

    //method for reading all genre entries & returning url
    static getAllGenres (){
        return $.get(this.url);
    }

    //method to return url & genre id using jquery selector
    static getGenre(id) {
        return $.get(this.url + `/${id}`);
    }

    //method for creating new genre and returning the new genre value concatenated w/ id
    static createGenre(genre) {
        // return $.ajax({
        //     url: this.url + `/${genre.id}`,
        //     dataType: 'json', 
        //     data: JSON.stringify(genre), 
        //     contentType: 'application/json',
        //     type: 'POST', //create
        //     crossDomain: true,
        // });

        return $.get(this.url, genre);
    } 

    //method for 
    static updateGenre(genre) {
        return $.ajax({
            url: this.url + `/${genre.id}`,
            dataType: 'json', 
            data: JSON.stringify(genre), 
            contentType: 'application/json',
            type: 'PUT', //update
            // crossDomain: true,
        });
    }
    
    //method that will target a specific genre id to delete from api
    static deleteGenre(id) {
        return $.ajax({
            url: this.url + `${id}`,
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

    //method for deleting genre
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
            if (genre.id == id) {
                genre.books.push(new Book($(`#${genre.id}-book-title`).val(), $(`#${genre.id}-book-author`).val()));
                GenreAdd.updateGenre(genre)
                    .then(() => {
                        return GenreAdd.getAllGenres();
                    })
                    .then((genres) => this.render(genres));
            }
        }
    }

    // method for deleting Book based off of genre ID, book ID & its index in the array, then updating & rendering the data
    static deleteBook (genreId, bookId) {
        for (let genre of this.genres) {
            if (genre.id == genreId) {
                for (let book of genre.books) {
                    if (book.id == bookId) {
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

    //method for rendering genres and building up card with add/delete control buttons
    static render(genres) {
        this.genres = genres;
        $('#app').empty();
        for(let genre of genres) {
            $('#app').prepend(
                `<div id="${genre.id}" class="card m-4">
                    <div class= "card-header">
                        <h2>${genre.name}</h2>
                        <button class= "btn btn-danger mb-5" onclick= "DOMManager.deleteGenre('${genre.id}')">Delete Genre</button>
                    </div>
                    
                    <div class= "card-body">
                        <div class= "card">
                            <div class= "row m-3">
                                <div class= "col-sm">
                                    <input type= "text" id="${genre.id}-book-title" class= "form-control" placeholder= "Book Title"> 
                                </div>

                                <div class= "col-sm">
                                    <input type= "text" id= "${genre.id}-book-author" class= "form-control" placeholder= "Book Author">
                                </div>
                            </div>
                            <button id="${genre.id}-new-book" onclick= "DOMManager.addBook('${genre.id}')": class="btn btn-warning form-control">Add Book</button>
                        </div>
                    </div>
                </div><br>`
            );

            //loop for appending each book to the id of current genre
            for(let book of genre.books) {
                $(`#${genre.id}`).find('.card-body').append(
                    `<p>
                        <span id="title-${book.id}"><strong>Title: </strong> ${book.title}</span>
                        <span id= "author-${book.id}"><strong>Author: </strong> ${book.author}</span>
                        <button class= "btn btn-danger" onclick= "DOMManager.deleteBook('${genre.id})', '${book.id}')">Delete Book</button>
                    </p>`
                )
            }
        }
    }
}

//grabbing button from html for add Genre
$('#create-new-genre').click(() => {
    DOMManager.createGenre($('#new-genre-name').val());
    $('#new-genre-name').val(''); // sets back to empty string
})

//code that will run render
DOMManager.getAllGenres();