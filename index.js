console.log("++++++++++++++++Sorting Movies+++++++++++++");
var recursive = require('recursive-readdir');
var path = require('path');
var omdb = require('omdb');

var repertoryRoot = 'C:\\Users\\edesir\\Documents\\Boulot\\Films';
var authorizedExtensions = ['.flv', '.mpg'];
var fileReleasePatterns = ['DVDRip', 'DVDSCR', 'XviD-MAXSPEED'];

var movieDB = [];

/**
 * This function checks is pathed as a filter to the recursive function. It filters out files which are not films. Mostly depending on their extensions
 * @param  {[type]}  file  
 * @param  {[type]}  stats 
 * @return {Boolean}       
 */
function isNotFilm(file, stats) {
    var fileExtension = path.extname(file);

    return (!stats.isDirectory()) && (authorizedExtensions.indexOf(fileExtension) === -1);
}

/**
 * This function classifies movies by genres
 * @param  {[type]} aMovieDB an array of movies from the API
 * @return {[type]}          an associative array 'genre' => [Movies]
 */
function classifyMoviesByGenre(aMovieDB) {
    var byGenres = {};
    aMovieDB.forEach(function(movie){
        var genres = movie.genres;
        genres.forEach(function(genre) {
            if (genre in byGenres) {
                byGenres[genre].push(movie);
            } else {
                byGenres[genre] = [movie];
            }
        });
    });

    return byGenres;
}


/**
 * This function creates an easily usable classification tree 
 * @param  {[type]} maxNbPerCategory [description]
 * @param  {[type]} aMovieDB    [description]
 * @return {[type]}             [description]
 */
function smartClassifier (maxNbPerCategory, aMovieDB) {

}

/**
 * This function cleans the file name of forbiden terms and file extension. It also extracts the release date of the film
 * @param  {[type]} filePath Full File Path
 * @return {[type]}          an object containing filepath, filmname and filmDate eventually
 */
function cleanFilmName(filePath) {
    var dateregex = /\(([^)]+)\)/;
    var filmDates = dateregex.exec(filePath);
    var returnFilm;
    if (filmDates !== null) {
        var filmDate = filmDates[1];
        returnFilm = {
            filmDate: filmDate
        };
    } else {
        returnFilm = {};
    }
    var filmName = filePath
        // file name
        .replace(/^.*[\\\/]/, '')
        // no extension
        .replace(/\.[^/.]+$/, '')
        // no release date
        .replace(/\(([^)]+)\)/, '');
    // no file relase terms
    fileReleasePatterns.forEach(function(fileReleasePattern) {
        filmName = filmName.replace(fileReleasePattern, '');
    });
    // trim
    filmName = filmName.trim();

    returnFilm.filePath = filePath;
    returnFilm.filmName = filmName;

    return returnFilm;
}

recursive(repertoryRoot, [isNotFilm], function (err, files) {
  // Files is an array of filename
    var finished = 0;
    files.forEach(function(filePath, index) {
        var probableFilmNameAndPath = cleanFilmName(filePath);
        var search = {
            title: probableFilmNameAndPath.filmName
        };
        if (probableFilmNameAndPath.filmDate !== null) {
            search.year = probableFilmNameAndPath.filmDate;
        }
        omdb.get(search, true, function(err, movie) {
            if(err) {
                
                return console.error(err);
            }
         
            if(!movie) {
                
                return console.log('Movie:'+probableFilmNameAndPath.filmName+' not found!');
            }
         
            movieDB.push(movie);

            if (movieDB.length === files.length) {
                // finished
                var byGenres = classifyMoviesByGenre(movieDB);
                console.log(byGenres);
            }
        });
    });
});





