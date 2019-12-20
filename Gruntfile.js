/*eslint-env node*/
/*global module:false*/
module.exports = function(grunt) {

    //these params only work if you use the "grunt deploy --user.." command instead of "npm run deploy"
    let sUser   = process.env.FTP_USER,
        sPwd    = process.env.FTP_PASS,
        dest    = grunt.option("dest");

    grunt.initConfig({

        "ftpAuth":{
            username: sUser,
            password:sPwd,
            dest: "/public_html/" + ( dest || "dev" )
        },
        
        "dir": {
            src: "webapp",
            dest: dest || "dist"
        },

        //clean dist folder
        "clean": {
            dist: "<%= dir.dest %>/**"
        },

		// Coding style!
		"eslint": {
			src: ["<%= dir.src %>"],
			gruntfile: ["Gruntfile.js"]
		},
        
        //copy from webapp to dist
        "copy": {
            dist: {
                files: [{
                    expand: true,
                    cwd: "<%= dir.src %>",
                    src: [
                        "**",
                        "!test/**"
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

        //FTP deploy:
        ftp_push: {
            dev: {
                options: {
                    host: "ftp.fiddle.be",
                    dest: "<%= ftpAuth.dest %>",
                    port: 21,
                    username: "<%= ftpAuth.username %>",
                    password: "<%= ftpAuth.password %>",
                    debug:true
                },
                files: [{
                    expand: true, //what does this do?
                    cwd: dest,
                    src: [
                        "**/*"
                    ]
                }]
            }
        }
    });


	//JSDoco parsing
	grunt.registerTask("jsdoc", "parsing all jsdoco into one big json file", function(){
		grunt.log.writeln("Generating JSDoc file");

		let done = this.async();

		let jsdocx = require("jsdoc-x");

		jsdocx.parse({
			files:[
				"./webapp/**/*.js",
				"!webapp/test/**",
				"!webapp/localService/**"
			],
			excludePattern:"(test|localService)",
			recurse:true,
			private:true,
			output:"./webapp/documentation.json",
			encoding:"utf-8"
		}, function (err, docs) {
			if (err) {
				grunt.log.writeln("JSDoc file generation failed with error:");
				grunt.log.writeln(err);
				done(false);
			} else {
				grunt.log.writeln("JSDoc file generated");
				done(true);
			}			
		});
	});

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-openui5");
	grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks('grunt-ftp-push');

    // lint task
    grunt.registerTask("lint", [ "eslint" ]);

    // deploy task
    grunt.registerTask("deploy", [ "clean", "eslint", "jsdoc", "openui5_preload",  "copy", "ftp_push" ]);
