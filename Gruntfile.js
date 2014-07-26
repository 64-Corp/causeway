/**
 * `grunt test`      -     run tests
 * `grunt lint`      -     lint front and backend
 * `grunt docs`      -     create docs
 * `grunt validate`  -     check everything is how it should be before making a pull request a main branch
 */

module.exports = function(grunt) {

    'use strict';

    grunt.initConfig({
        jshint: {
            options: {
                node : true,        // node variables
                curly: true,        // disallow functions without curly braces
                eqeqeq: true,       // === and  !== instead of == and !=
                strict: true,       // have to enable strict mode
                undef: true,        // disallow globally defined variables
                noarg: true,        // prevents depreciated javascript functions
                loopfunc: true,     // disallow functions inside loops
                immed: true,        // disallow immediate functions, they need ()
                indent: 4,          // force tab indentation to be set to 4
                quotmark: 'single', // force use of single quotation marks
                camelcase: true,    // forces camel case - note this needs to be ignored when using json apis
                unused: true,       // disallows unused variables
                eqnull: true,       // allow variable comparison with null or undefined
                laxcomma: true,     // allow commas before variables or keys
                globals: {
                },
                reporter: require('jshint-stylish')
            },
            uses_defaults: ['lib/**/**/*.js']
        },
        jsdox: {
            generate: {
                options: {
                    contentsEnabled: true,
                    contentsTitle: 'Causeway',
                    contentsFile: 'readme.md'
                },
                src: ['lib/**/**/*.js', 'test/**/**/*.js'],
                dest: 'docs'
            }
        },
        mochaTest: {
            lib: {
                options: {
                    reporter: 'spec',
                    growl: true,
                    colors: true
                },
                src: ['test/**/**/**/*.js']
            }
        }
    });

    // npm modules
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdox');
    grunt.loadNpmTasks('grunt-mocha-test');

    // tasks
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('docs', ['jsdox']);
    grunt.registerTask('default', ['mochaTest', 'lint', 'docs']);
};
