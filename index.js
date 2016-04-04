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
    var filmDate = filmDates[1];
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

    return {
        filmName,
        filePath,
        filmDate
    }
}


recursive(repertoryRoot, [isNotFilm], function (err, files) {
  // Files is an array of filename
  files.forEach(function(filePath) {
    var probableFilmNameAndPath = cleanFilmName(filePath);
    console.log(probableFilmNameAndPath);
    omdb.get({ title: probableFilmNameAndPath.filmName, year: probableFilmNameAndPath.filmDate }, true, function(err, movie) {
        if(err) {
            
            return console.error(err);
        }
     
        if(!movie) {
            
            return console.log('Movie not found!');
        }
     
        console.log('%s (%d) %d/10', movie.title, movie.year, movie.imdb.rating);
        console.log(movie.plot);
       
    });
  });
});





