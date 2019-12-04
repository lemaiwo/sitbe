/*eslint-env node*/
/*global module:false*/
module.exports = function(grunt) {

    var sUser = grunt.option("user"),
        sPwd = grunt.option("pwd");

    grunt.initConfig({

        "pdfAuth":{
            username: sUser,
            password:sPwd
        },
        
        "dir": {
            src: "webapp",
            dest: "dist"
        },

        //clean dist folder
        "clean": {
            dist: "<%= dir.dest %>/**"
        },
        
        //copy from webapp to dist
        "copy": {
            dist: {
                files: [{
                    expand: true,
                    cwd: "<%= dir.src %>",
                    src: [
                        "**",
                        "!test/**",
                    ],
                    dest: "<%= dir.dest %>"
                }]
            }
        },
        
        //preload generation
        "openui5_preload": {
            component: {
                options: {
                    resources: {
                        cwd: "<%= dir.src %>",
                        prefix: "be/fiddle/sitbe",
                        src: [
                            "**/*.js",
                            "**/*.fragment.html",
                            "**/*.fragment.json",
                            "**/*.fragment.xml",
                            "**/*.view.html",
                            "**/*.view.json",
                            "**/*.view.xml",
                            "**/*.properties",
                            "**/*.json",
                            "**/*.css"
                        ]
                    },
                    dest: "<%= dir.dest %>",
                    compress: true
                },
                components: "be/fiddle/sitbe"
            }
        },

        "ftp-deploy": {
            build: {
                auth: {
                    host: 'fiddle.be',
                    port: 21,
                    authKey: 'pdfAuth'
                },
                src: './dist',
                dest: '/sitbe/',
                exclusions: []
            }
        }
    });

	//JSDoco parsing
	grunt.registerTask('jsdoc', 'parsing all jsdoco into one big json file', function(){
		grunt.log.writeln('Generating JSDoc file');
		var done = this.async();

		var jsdocx = require('jsdoc-x');

		jsdocx.parse({
			files:[
				'./webapp/**/*.js',
				"!webapp/test/**",
				"!webapp/localService/**"
			],
			excludePattern:'(test|localService)',
			recurse:true,
			private:true,
			output:'./webapp/documentation.json',
			encoding:'utf-8'
		}, function (err, docs) {
			if (err) {
				grunt.log.writeln('JSDoc file generation failed with error:');
				grunt.log.writeln(err);
				done(false);
			} else {
				grunt.log.writeln('JSDoc file generated');
				done(true);
			}			
		});
	});

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-openui5");
    grunt.loadNpmTasks('grunt-ftp-deploy');

    // Build task
    grunt.registerTask("build", [ "jsdoc", "openui5_preload",  "copy" ]);

    // Default task
    grunt.registerTask("default", ["clean", "build", "ftp-deploy"]);
};
