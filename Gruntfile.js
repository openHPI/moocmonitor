module.exports = function (grunt) {
    // Load all grunt tasks matching the `grunt-*` pattern,
    // unless we're on Linux or Windows
    if (process.platform && process.platform === 'darwin') {
        require('load-grunt-tasks')(grunt);
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
                icon: './public/icon/ase.icns',
                background: './postcompile/osx/background.tiff',
                'icon-size': 156,
                contents: [{
                    x: 470,
                    y: 430,
                    type: 'link',
                    path: '/Applications'
                }, {
                    x: 120,
                    y: 430,
                    type: 'file',
                    path: './builds/storageexplorer-darwin-x64/moocmonitor.app'
                }]
            },
            target: {
                dest: './builds/Mooc Monitor-darwin-x64/moocmonitor.dmg'
            }
        },
        copy: {
            app: {
                expand: true,
                src: ['electron.js', 'package.json', 'dist/**', 'node_modules/fs-extra/**', 'node_modules/electron-gh-releases/**'],
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
                iconUrl: 'http://raw.githubusercontent.com/azure-storage/xplat/master/public/icon/ase.ico',
                setupIcon: 'public/icon/ase.ico',
                authors: 'Jan Renz',
                loadingGif: 'postcompile/windows/installer.gif'
            },
            x64: {
                appDirectory: 'builds/moocmonitor-win32-x64',
                outputDirectory: 'builds/installer64',
                exe: 'moocmonitor.exe',
                iconUrl: 'http://raw.githubusercontent.com/azure-storage/xplat/master/public/icon/ase.ico',
                setupIcon: 'public/icon/ase.ico',
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
                    name: 'Mooc Monitor',
                    platform: 'darwin',
                    arch: 'x64',
                    dir: 'electronbuildcache',
                    out: 'builds',
                    version: '0.32.1',
                    overwrite: true,
                    icon: 'public/icon/ase.icns',
                    'app-version': getVersion(),
                    'build-version': getVersion()
                }
            },
            windows: {
                options: {
                    name: 'moocmonitor',
                    platform: 'win32',
                    arch: 'all',
                    dir: 'electronbuildcache',
                    out: 'builds',
                    version: '0.32.1',
                    overwrite: true,
                }
            },
            windowsWithIcon: {
                options: {
                    name: 'moocmonitor',
                    platform: 'win32',
                    arch: 'all',
                    dir: 'electronbuildcache',
                    out: 'builds',
                    version: '0.32.1',
                    overwrite: true,
                    icon: 'public/icon/ase.ico',
                    asar: true,
                    'version-string': {
                        ProductName: 'Mooc Monitor',
                        ProductVersion: getVersion(),
                        FileDescription: 'Mooc Monitor',
                        ProductVersion: 'Mooc Monitor.exe'
                    }
                }
            },
            linux: {
                options: {
                    name: 'mooc monitor',
                    platform: 'linux',
                    arch: 'ia32',
                    dir: 'electronbuildcache',
                    out: 'builds',
                    version: '0.32.1',
                    overwrite: true
                }
            },
        },
        exec: {
            build: {
                command: 'node ./node_modules/ember-cli/bin/ember build --environment=production'
            },
            flatten: {
              command: 'node ../node_modules/flatten-packages/bin/flatten .',
              cwd: './electronbuildcache'
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
        'if': {
            'trusted-deploy-to-azure-cdn-windows': {
                options: {
                    test: function () {
                        // these variables will only be valid and set during trusted builds
                        var trustedBuild = (typeof process.env.AZURE_STORAGE_ACCOUNT === 'string' && typeof process.env.AZURE_STORAGE_ACCESS_KEY === 'string');
                        return trustedBuild;
                    }
                },
                ifTrue: ['azure-cdn-deploy:windows'],
                ifFalse: []
            },
            'trusted-deploy-to-azure-cdn-unix': {
                options: {
                    test: function () {
                        // these variables will only be valid and set during trusted builds
                        var trustedBuild = (typeof process.env.AZURE_STORAGE_ACCOUNT === 'string' && typeof process.env.AZURE_STORAGE_ACCESS_KEY === 'string');
                        return trustedBuild;
                    }
                },
                ifTrue: ['azure-cdn-deploy:osx', 'azure-cdn-deploy:linux'],
                ifFalse: []
            }
        },
        // deploys live build to cdn
        'azure-cdn-deploy': {
            linux: {
                options: {
                    containerName: 'builds', // container name in blob
                    folder: cdnPath + '/linux32', // path within container
                    zip: false, // gzip files if they become smaller after zipping, content-encoding header will change if file is zipped
                    deleteExistingBlobs: false, // true means recursively deleting anything under folder
                    concurrentUploadThreads: 10, // number of concurrent uploads, choose best for your network condition
                    metadata: {
                        cacheControl: 'public, max-age=31530000', // cache in browser
                        cacheControlHeader: 'public, max-age=31530000' // cache in azure CDN. As this data does not change, we set it to 1 year
                    },
                    testRun: false // test run - means no blobs will be actually deleted or uploaded, see log messages for details
                },
                src: [
                    './build.zip'
                ],
                cwd: './builds/moocmonitor-linux-ia32/'
            },
            osx: {
                options: {
                    containerName: 'builds', // container name in blob
                    folder: cdnPath + '/darwin64', // path within container
                    zip: false, // gzip files if they become smaller after zipping, content-encoding header will change if file is zipped
                    deleteExistingBlobs: false, // true means recursively deleting anything under folder
                    concurrentUploadThreads: 10, // number of concurrent uploads, choose best for your network condition
                    metadata: {
                        cacheControl: 'public, max-age=31530000', // cache in browser
                        cacheControlHeader: 'public, max-age=31530000' // cache in azure CDN. As this data does not change, we set it to 1 year
                    },
                    testRun: false // test run - means no blobs will be actually deleted or uploaded, see log messages for details
                },
                src: [
                    './build.zip'
                ],
                cwd: './builds/moocmonitor-darwin-x64/'
            },
            windows: {
                options: {
                    containerName: 'builds', // container name in blob
                    folder: cdnPath + '/win32', // path within container
                    zip: false, // gzip files if they become smaller after zipping, content-encoding header will change if file is zipped
                    deleteExistingBlobs: false, // true means recursively deleting anything under folder
                    concurrentUploadThreads: 10, // number of concurrent uploads, choose best for your network condition
                    metadata: {
                        cacheControl: 'public, max-age=31530000', // cache in browser
                        cacheControlHeader: 'public, max-age=31530000' // cache in azure CDN. As this data does not change, we set it to 1 year
                    },
                    testRun: false // test run - means no blobs will be actually deleted or uploaded, see log messages for details
                },
                src: [
                    './build.zip'
                ],
                cwd: './builds/moocmonitor-win32-ia32/'
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
    grunt.registerTask('copyForBuild', ['copy:app', 'copy:version_file']);
    grunt.registerTask('prebuild', ['clean', 'exec:build', 'file-creator:version_file', 'copyForBuild']);
    grunt.registerTask('osx', ['clean', 'prebuild', 'electron:osx', 'appdmg']);
    grunt.registerTask('linux', ['prebuild', 'electron:linux']);
    grunt.registerTask('windows', ['prebuild', 'exec:flatten', 'electron:windowsWithIcon', 'create-windows-installer']);
    grunt.registerTask('compile', ['prebuild', 'electron:osx', 'appdmg', 'electron:linux', 'electron:windows', 'create-windows-installer']);

    // Development Builds
    // To deploy a build with an official build number, set env var RELEASE_VERSION to release number
    // otherwise application is tagged with git hash
    grunt.registerTask('createUnixDevBuild', ['prebuild', 'exec:flatten', 'electron:osx', 'electron:linux', 'zip:osx', 'zip:linux']);
    grunt.registerTask('deployUnixDevBuild', ['if:trusted-deploy-to-azure-cdn-unix']);
    grunt.registerTask('createWinDevBuild', ['prebuild', 'exec:flatten', 'electron:windowsWithIcon', 'zip:windows']);
    grunt.registerTask('deployWinDevBuild', ['if:trusted-deploy-to-azure-cdn-windows']);
};
