console.log("++++++++++++++++Sorting Movies+++++++++++++");
var recursive = require('recursive-readdir');
var path = require('path');
var omdb = require('omdb');

var repertoryRoot = 'C:\\Users\\edesir\\Documents\\Boulot\\Films';
var authorizedExtensions = ['.flv', '.mpg'];
var fileReleasePatterns = ['DVDRip', 'DVDSCR', 'XviD-MAXSPEED'];


function isNotFilm(file, stats) {
    var fileExtension = path.extname(file);

    return (!stats.isDirectory()) && (authorizedExtensions.indexOf(fileExtension) === -1);
}

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
  files.forEach(function(filePath) {
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
     
        console.log('%s (%d) %d/10', movie.title, movie.year, movie.imdb.rating);
        console.log(movie.plot);
        // console.log(movie.genres);
        // console.log(movie);
       
    });
  });
});





