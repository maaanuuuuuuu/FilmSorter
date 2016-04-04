console.log("++++++++++++++++Sorting Movies+++++++++++++");
var recursive = require('recursive-readdir');
var path = require("path");

var repertoryRoot = "C:\\Users\\edesir\\Documents\\Boulot\\Films";
var authorizedExtensions = ['.flv', '.mpg'];
var fileReleasePatterns = ['DVDRip', 'DVDSCR', 'XviD-MAXSPEED'];


function isNotFilm(file, stats) {
    var fileExtension = path.extname(file);

    return (!stats.isDirectory()) && (authorizedExtensions.indexOf(fileExtension) === -1);
}

function cleanFilmName(filePath) {
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
        filePath
    }
}


recursive(repertoryRoot, [isNotFilm], function (err, files) {
  // Files is an array of filename
  files.forEach(function(filePath) {
    var probableFilmNameAndPath = cleanFilmName(filePath);
    console.log(probableFilmNameAndPath);

  });
});





