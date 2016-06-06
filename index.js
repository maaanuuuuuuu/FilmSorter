console.log("++++++++++++++++Sorting Movies+++++++++++++");
var recursive = require('recursive-readdir');
var path = require('path');
var omdb = require('omdb');

String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
};

var repertoryRoot = 'C:\\Users\\edesir\\Documents\\Boulot\\FilmSorter\\FilmFolder';
var authorizedExtensions = ['.flv', '.mpg'];
var fileReleasePatterns = ['subtitles',"director's cut",'dvd', 'brrip', 'klaxxon', 'dvdrip', 'dvdscr', 'xvid-maxspeed', 'tbs', 'ntsc', /\[(.+?)\]/g, /\((.+?)\)/g, 'xvid', 'dvdrip', 'axxo', 'phrax', 'r5', 'fxg', 'unrated'];
var toBeReplacedBySpace = ['.', '-', '_'];

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
 * @param  {[type]} aMovieDB         [description]
 * @param  {[type]} maxNbPerCategory [description]
 * @param  {[type]} minNbPerCategory [description]
 * @return {[type]}                  [description]
 */
function smartClassifier(aMovieDB, maxNbPerCategory, minNbPerCategory) {

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
    filmName = filmName.toLowerCase();
    // replace dots by spaces
    toBeReplacedBySpace.forEach(function(separator) {
        filmName = filmName.replace(separator, ' ');
    });
    // no file relase terms (delete everything after that)
    fileReleasePatterns.forEach(function(fileReleasePattern) {
        var indexSub = filmName.regexIndexOf(fileReleasePattern);
        if (indexSub > 0) {
            filmName = filmName.substring(0, indexSub);
        }
    });
    // 
    // trim
    filmName = filmName.trim();

    returnFilm.filePath = filePath;
    returnFilm.filmName = filmName;

    return returnFilm;
}

recursive(repertoryRoot, [isNotFilm], function (err, files) {
  // Files is an array of filename
    var realIndex = 0;
    var i = 0;
    var j = 0;
    console.log(files.length);
    files.forEach(function(filePath, index) {
        realIndex++;
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
                
                i++;
                // console.log('Movie:'+probableFilmNameAndPath.filmName+' not found!');
            } else {

                j++;
                // console.log('Movie:'+probableFilmNameAndPath.filmName+' found!');
            }
         
            movieDB.push(movie);
            if (realIndex === files.length) {
                // finished
                // var byGenres = classifyMoviesByGenre(movieDB);
                // console.log(byGenres);
                console.log("Did Find: "+j);
                console.log("Did Not Find: "+i);
                
            }
        });
    });
    
});





