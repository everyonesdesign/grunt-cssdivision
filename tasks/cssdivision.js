/*
 * grunt-cssdivision
 * https://github.com/everyonesdesign/grunt-cssdivision
 *
 * Copyright (c) 2014 Yura Trambitskiy
 * Licensed under the MIT license.
 */

//TODO: write docs

'use strict';


module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('cssdivision', 'Grunt plugin to divide CSS file into basic and decorative styles', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            props: /padding|margin|height|width|display|float|font/,
            destDir: "dest/"
        });

        //adding slash at the end if there's no
        options.destDir = options.destDir.replace(/\/?$/, "/");

        // Iterate over all specified file groups.
        this.files.forEach(function (f) {
            var src = f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (filepath) {
                // Read file source.
                grunt.log.writeln('File "' + filepath + '" is being divided...');
                divideCSS(filepath, options.destDir, options.props);
            });
        });
    });

    function divideCSS(src, destDir, props) {

        var fs = require('fs'),
            css = require('css'),
            stylesheetText,
            filename = src.replace(/(.*\/?)(\w\d\._\-)$/, "$2");

        stylesheetText = grunt.file.read(src, {
            encoding: "UTF-8"
        });

        function divideStylesheet(stylesheet, baseStyles) {
            var parsedStylesheet = css.parse(stylesheet);
            for (var i = 0; i < parsedStylesheet.stylesheet.rules.length; i++) {
                if (baseStyles && !/rule/.test(parsedStylesheet.stylesheet.rules[i].type)) {
                    parsedStylesheet.stylesheet.rules.splice(i, 1);
                    i--;
                } else if (parsedStylesheet.stylesheet.rules[i].declarations) {
                    for (var j = 0; j < parsedStylesheet.stylesheet.rules[i].declarations.length; j++) {
                        var declaration = parsedStylesheet.stylesheet.rules[i].declarations[j],
                            property = declaration.property;
                        if (
                            ( baseStyles && !props.test(property) ) ||
                                ( !baseStyles && props.test(property) )
                            ) {
                            parsedStylesheet.stylesheet.rules[i].declarations.splice(j, 1);
                            j--;
                        }
                    }
                }
            }
            return css.stringify(parsedStylesheet, {
                compress: true
            });
        }

        try {
            grunt.file.write(destDir.replace("\/?$", "/") + filename.replace(/\.\w+$/, ".main$&"), divideStylesheet(stylesheetText, true));
            grunt.log.writeln('File "' + filename.replace(/\.\w+$/, ".main$&") + '" created.');
            grunt.file.write(destDir.replace("\/?$", "/") + filename.replace(/\.\w+$/, ".decorative$&"), divideStylesheet(stylesheetText, false));
            grunt.log.writeln('File "' + filename.replace(/\.\w+$/, ".decorative$&") + '" created.');
        } catch(e) {
            grunt.log.error(e);
            throw new Error("Something went wrong with cssdivision grunt module");
        }

    }

};
