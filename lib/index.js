const chalk = require('chalk');
const download = require('download');
const exec = require('child_process');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const pleasant = require('pleasant-progress');

// HELLO
log('app', `Create a New Workbench Project`);

// Set constants
const argv = parseArgv();

// Use CLI arguments to set variables
const dev = argv.options.dev || false;
const downloadUrl = dev ? 'https://github.com/wbrowar/workbench/archive/dev.zip' : 'https://github.com/wbrowar/workbench/archive/main.zip';
const npmInstaller = argv.options.installer ? argv.options.installer : 'npm';
const localRepo = argv.options.local ? argv.options.local.endsWith(`/`) ? argv.options.local.slice(0, -1) : argv.options.local : false;
const pkg = require(`../package.json`);
const unzippedDirName = dev ? 'dev' : 'main';
const verbose = argv.options.verbose || false;

function run() {
    const questions = [{
        type: 'input',
        name: 'handle',
        message: 'Project handle (names the project directory, database, git repo, etc...)',
        default: `wb-test-${ new Date().getFullYear() }`,
        validate: (answer) => {
            return answer !== '';
        },
    },{
        type: 'confirm',
        name: 'enableInstall',
        message: 'Continue with install in existing directory?',
        default: true,
        when: (answers) => {
            if (fs.existsSync(`./${ answers.handle }`)) {
                log('warn', `Installing in an existing directory will overwrite existing files.`, true);
                return true;
            }
            return false;
        },
    }];

    inquirer.prompt(questions).then((answers) => {
        log('verbose', `Answers:`, verbose);
        log('dump', answers, verbose);

        if (answers.enableInstall ? answers.enableInstall : true) {
            const name = answers.handle,
                  projectDir = `${process.cwd()}/${ name }`;

            log('verbose', `Checking to see if project folder already exists`, verbose);
            if (!fs.existsSync(projectDir)) {
                // Create project folder
                log('verbose', `Creating project folder`, verbose);
                fs.mkdirSync(projectDir);
            }

            // Change working directory to new project folder
            try {
                process.chdir(projectDir);
                log('verbose', `Changing working directory to project folder`, verbose);
            }
            catch (err) {
                log('warn', err, verbose);
                process.exit();
            }

            log('verbose', `Downloading Workbench`, verbose);
            downloadFromUrl(downloadUrl, () => {
                log('verbose', `Workbench downloaded`, verbose);

                log('title', 'Moving Files');

                if (localRepo) {
                    if (fs.pathExists(`${localRepo}/_install`)) {
                        fs.copySync(`${localRepo}/_install`, `${projectDir}/SETUP/_install`);
                        log('verbose', `Copied ${localRepo}/_install to ${projectDir}/SETUP/_install`, verbose);
                    }
                    if (fs.pathExists(`${localRepo}/_wb`)) {
                        fs.copySync(`${localRepo}/_wb`, `${projectDir}/_wb`);
                        log('verbose', `Copied ${localRepo}/_wb to ${projectDir}/_wb`, verbose);
                    }
                } else {
                    if (fs.pathExists(`SETUP/workbench-${ unzippedDirName }/_install`)) {
                        verboseExec(`mv SETUP/workbench-${ unzippedDirName }/_install ${projectDir}/SETUP/_install`, verbose);
                        log('verbose', `Moved _install`, verbose);
                    }
                    if (fs.pathExists(`SETUP/workbench-${ unzippedDirName }/_wb`)) {
                        verboseExec(`mv SETUP/workbench-${ unzippedDirName }/_wb ${projectDir}/_wb`, verbose);
                        log('verbose', `Moved _wb`, verbose);
                    }
                }

                log('title', 'Starting Install');

                try {
                    process.chdir(`${projectDir}/SETUP/_install`);
                    log('verbose', `Changed working directory to install folder`, verbose);
                }
                catch (err) {
                    log('warn', err, verbose);
                    process.exit();
                }

                log('verbose', `installing modules needed for install`, verbose);
                verboseExec(`${ npmInstaller } install`, verbose);

                const installCommand = `node ./install.cjs --handle='${ name }' --project-dir='${ projectDir }' --version='${pkg.version}' ${ dev ? '--dev' : '' } ${ verbose ? '--verbose' : '' }`;
                log('running', installCommand, verbose);
                exec.spawnSync(installCommand, [], { stdio: 'inherit', shell: true });
            });
        } else {
            log('app', `Exiting without installing.`);
        }
    });
}

// download a file and run a callback
function downloadFromUrl(url, cb) {
    if (localRepo) {
        cb();
    } else {
        let progress = new pleasant();
        progress.start(chalk.blue.bold('[ Downloading ') + url + chalk.blue.bold(' ]'));
        download(url, 'SETUP', { extract: true }).then(() => {
            progress.stop();
            cb();
        }).catch((error) => {
            console.log(error);
            process.exit();
        });
    }
}

// display a message in the command line
function log(type = 'message', message, verbose = false) {
    switch (type) {
        case 'app':
            console.log(chalk.bgRgb(230, 20, 20)(`  ${ message }  `));
            break;
        case 'dump':
            if (verbose) {
                console.log(chalk.magenta.bold(`📦 ${ JSON.stringify(message, null, 2) }`));
            }
            break;
        case 'running':
            console.log(chalk.green.bold(`💻 ${ chalk.green(message) }`));
            break;
        case 'title':
            console.log(chalk.blue.bold(`🛠 ${ message }`));
            break;
        case 'verbose':
            if (verbose) {
                console.log(chalk.keyword('orange')(`🕵 ${ message }`));
            }
            break;
        case 'warn':
            console.warn(chalk.red.bold(`🚧 ${ message }`));
            break;
        default:
            console.log(message);
    }
}

// parse process arguments into an array format
function parseArgv() {
    let args = [];
    let options = {};

    process.argv.forEach(function(arg, i) {
        if(i > 1) {
            if (arg.substr(0, 2) === "--") {
                // remove leading dashes
                const str = arg.substr(2);

                // split out to key/value pairs
                if (str.indexOf("=") !== -1) {
                    const strSplit = str.split('=');
                    options[strSplit[0]] = strSplit[1];
                } else {
                    options[str] = true;
                }
            }
            else {
                args.push(arg);
            }
        }
    });

    return {
        args: args,
        options: options
    }
}

// determine if a command should be displayed in terminal when running shell commands
function verboseExec(command, verbose = false) {
    if (verbose) {
        log('running', command);
        exec.spawnSync(command, [], { stdio: 'inherit', shell: true });
    } else {
        exec.execSync(`${command} > /dev/null 2>&1`);
    }
}

exports.run = run;