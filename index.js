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
    static url= 'https://64412ead792fe886a8a09b3d.mockapi.io/:endpoint'; // needs api added

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
            url: this.url + `${genre._id}`,
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

    //method for rendering genres

}

DOMManager.getAllGenres();