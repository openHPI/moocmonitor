module.exports = function (grunt) {
    // Load all grunt tasks matching the `grunt-*` pattern,
    // unless we're on Linux or Windows
    if (process.platform && process.platform === 'darwin') {
        //require('load-grunt-tasks')(grunt);
        require('load-grunt-tasks')(grunt, {scope: ['devDependencies', 'dependencies']});
    } else {
        require('load-grunt-tasks')(grunt, {scope: ['devDependencies', 'dependencies']});
    }

    // Get Version
    function getVersion () {
        var githash = require('githash');
        var version = process.env.RELEASE_VERSION ? process.env.RELEASE_VERSION : githash();
    }

    var files = ['app/**/*.js', 'Brocfile.js'];
    // Tagged builds get their own folders. live builds just go to live folder
    var cdnPath = process.env.RELEASE_VERSION ? process.env.RELEASE_VERSION : 'live';

    grunt.initConfig({
        appdmg: {
            options: {
                title: 'MOOC Monitor',
                icon: './public/icon/moocmonitor.icns',
                background: './postcompile/osx/background.tiff',
                "icon-size": 156,
                contents: [{
                    x: 470,
                    y: 430,
                    type: 'link',
                    path: '/Applications'
                }, {
                    x: 120,
                    y: 430,
                    type: 'file',
                    path: './builds/moocmonitor-darwin-x64/moocmonitor.app'
                }]
            },
            target: {
                dest: './builds/moocmonitor-darwin-x64/moocmonitor.dmg'
            }
        },
        copy: {
            app: {
                expand: true,
                src: ['electron.js',
                  'package.json',
                  'dist/**',
                  'public/icon/**' ,
                  'node_modules/lodash*/**',
                  'node_modules/abbrev/**' ,
                  'node_modules/acorn/**' ,
                  'node_modules/amdefine/**' ,
                  'node_modules/ansi*/**' ,
                  'node_modules/argparse/**' ,
                  'node_modules/ast-types/**' ,
                  'node_modules/async/**' ,
                  'node_modules/balanced-match/**' ,
                  'node_modules/c*/**' ,
                  'node_modules/debug/**' ,
                  'node_modules/entities/**' ,
                  'node_modules/es*/**' ,
                  'node_modules/ex*/**' ,
                  'node_modules/fs-*/**' ,
                  'node_modules/electron*/**' ,
                  'node_modules/glob/**' ,
                  'node_modules/gro*/**' ,
                  'node_modules/inflight/**' ,
                  'node_modules/inherits/**' ,
                  'node_modules/linkify-it/**' ,
                  'node_modules/i*/**' ,
                  'node_modules/j*/**' ,
                  'node_modules/n*/**' ,
                  'node_modules/m*/**' ,
                  'node_modules/o*/**' ,
                  'node_modules/p*/**' ,
                  'node_modules/q*/**' ,
                  'node_modules/s*/**' ,
                  'node_modules/t*/**' ,
                  'node_modules/u*/**' ,
                  'node_modules/v*/**' ,
                  'node_modules/w*/**' ,
                  'node_modules/y*/**' ,
                  'node_modules/rimraf/**' ,
                  'node_modules/concat-map/**' ,
                  'node_modules/brace-expansion/**' ,
                  'node_modules/electron-settings/**'
                 ],
                 // 'node_modules/electron-gh-releases/**'],
                dest: 'electronbuildcache/'
            },
            version_file: {
                src: ['./.version'],
                dest: 'electronbuildcache/dist/version'
            }
        },
        'create-windows-installer': {
            ia32: {
                appDirectory: 'builds/moocmonitor-win32-ia32',
                outputDirectory: 'builds/installer32',
                exe: 'moocmonitor.exe',
                iconUrl: 'http://raw.githubusercontent.com/azure-storage/xplat/master/public/icon/icon_org.ico',
                setupIcon: 'public/icon/icon_org.ico',
                authors: 'Jan Renz',
                loadingGif: 'postcompile/windows/installer.gif'
            },
            x64: {
                appDirectory: 'builds/moocmonitor-win32-x64',
                outputDirectory: 'builds/installer64',
                exe: 'moocmonitor.exe',
                iconUrl: 'http://raw.githubusercontent.com/azure-storage/xplat/master/public/icon/icon_org.ico',
                setupIcon: 'public/icon/icon_org.ico',
                authors: 'Jan Renz',
                loadingGif: 'postcompile/windows/installer.gif'
            }
        },
        jshint: {
            files: files,
            options: {
                jshintrc: './.jshintrc'
            }
        },
        jscs: {
            files: {
                src: files
            },
            options: {
                config: '.jscsrc',
                esnext: true
            }
        },
        jsbeautifier: {
            test: {
                files: {
                    src: files
                },
                options: {
                    mode: 'VERIFY_ONLY',
                    config: '.beautifyrc'
                }
            },
            write: {
                files: {
                    src: files
                },
                options: {
                    config: '.beautifyrc'
                }
            }
        },
        electron: {
            osx: {
                options: {
                    name: 'moocmonitor',
                    platform: 'darwin',
                    arch: 'x64',
                    dir: 'electronbuildcache',
                    out: 'builds',
                    version: '0.35.2',
                    overwrite: true,
                    icon: 'public/icon/moocmonitor.icns',
                    "app-version": getVersion(),
                    "build-version": getVersion()
                }
            },
            windows: {
                options: {
                    name: 'moocmonitor',
                    platform: 'win32',
                    arch: 'all',
                    dir: 'electronbuildcache',
                    out: 'builds',
                    version: '0.35.2',
                    icon: 'public/icon/menubar_icon.ico',
                    overwrite: true
                }
            },
            windowsWithIcon: {
                options: {
                    name: 'moocmonitor',
                    platform: 'win32',
                    arch: 'all',
                    dir: 'electronbuildcache',
                    out: 'builds',
                    version: '0.35.2',
                    overwrite: true,
                    icon: 'public/icon/menubar_icon.ico',
                    asar: true,
                    "app_version": "0.1"

                }
            },
            linux: {
                options: {
                    name: 'mooc monitor',
                    platform: 'linux',
                    arch: 'ia32',
                    dir: 'electronbuildcache',
                    out: 'builds',
                    version: '0.35.2',
                    overwrite: true
                }
            },
        },
        exec: {
            build: {
                command: 'node ./node_modules/ember-cli/bin/ember build --environment=production'
            },
          signosx: {
            command: './postcompile/osx/codesign.sh builds/moocmonitor-darwin-x64/moocmonitor.app'
          }
        },

        zip: {
            linux: {
                cwd: './builds/moocmonitor-linux-ia32',
                src: ['./builds/moocmonitor-linux-ia32/**/*'],
                dest: './builds/moocmonitor-linux-ia32/build.zip'
            },
            osx: {
                cwd: './builds/moocmonitor-darwin-x64',
                src: ['./builds/moocmonitor-darwin-x64/**/*'],
                dest: './builds/moocmonitor-darwin-x64/build.zip'
            },
            windows: {
                cwd: './builds/moocmonitor-win32-ia32',
                src: ['./builds/moocmonitor-win32-ia32/*'],
                dest: './builds/moocmonitor-win32-ia32/build.zip'
            }
        },
        'file-creator': {
          version_file: {
            '.version': function (fs, fd, done) {
              var githash = require('githash');
              var version = process.env.RELEASE_VERSION ? process.env.RELEASE_VERSION : githash();
              fs.writeSync(fd, version);
              done();
            }
          }
        },
        clean: ['./electronbuildcache', './dist', './builds'],
    });

    grunt.registerTask('test', ['jshint', 'jscs', 'jsbeautifier:test']);
    grunt.registerTask('copyForBuild', ['copy:app']);
    grunt.registerTask('prebuild', ['clean', 'exec:build', 'copyForBuild']);
    grunt.registerTask('osx', ['clean', 'prebuild', 'electron:osx', 'exec:signosx', 'appdmg']);
    grunt.registerTask('linux', ['prebuild', 'electron:linux']);
    grunt.registerTask('windows', ['prebuild', 'electron:windowsWithIcon', 'create-windows-installer']);
    //grunt.registerTask('compile', ['prebuild', 'electron:osx', 'appdmg', 'electron:linux', 'electron:windows', 'create-windows-installer']);

    // Development Builds
    // To deploy a build with an official build number, set env var RELEASE_VERSION to release number
    // otherwise application is tagged with git hash
    grunt.registerTask('createUnixDevBuild', ['prebuild', 'electron:osx', 'electron:linux', 'zip:osx', 'zip:linux']);
    grunt.registerTask('createWinDevBuild', ['prebuild','electron:windows', 'zip:windows']);
    grunt.registerTask('createWinDevBuildWithInstaller', ['prebuild', 'electron:windows', 'create-windows-installer']);

};
