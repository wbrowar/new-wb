const chalk = require('chalk'),
      download = require('download'),
      exec = require('child_process'),
      fs = require('fs-extra'),
      inquirer = require('inquirer'),
      pleasant = require('pleasant-progress');

// HELLO
log('app', `Create a New WB-Starter Project`);

// set constants
const argv = parseArgv();

// use CLI arguments to set variables
const dev = argv.options.dev || false,
      downloadUrl = dev ? 'https://github.com/wbrowar/WB-Starter/archive/dev.zip' : 'https://github.com/wbrowar/WB-Starter/archive/master.zip',
      unzippedDirName = dev ? 'dev' : 'master',
      verbose = argv.options.verbose || false;

function run() {
    const questions = [{
        type: 'input',
        name: 'clientCode',
        message: 'Client code',
        default: 'wb',
        validate: (answer) => {
            return answer !== '';
        },
    },{
        type: 'input',
        name: 'projectName',
        message: 'Project name (machine readable)',
        default: 'test',
        validate: (answer) => {
            return answer !== '';
        },
    }];

    inquirer.prompt(questions).then((answers) => {
        log('verbose', `Answers:`, verbose);
        log('dump', answers, verbose);

        const name = answers['clientCode'].toLowerCase() + '-' + answers['projectName'].toLowerCase(),
              projectDir = `./${ name }`;

        log('verbose', `Checking to see if project folder already exists`, verbose);
        if (!fs.existsSync(projectDir)) {
            // create project folder
            log('verbose', `Creating project folder`, verbose);
            fs.mkdirSync(projectDir);

            // change working directory to new project folder
            log('verbose', `Changing working directory to project folder`, verbose);
            process.chdir(projectDir);

            log('verbose', `Downloading WB-Starter`, verbose);
            downloadFromUrl(downloadUrl, () => {
                log('verbose', `WB Starter downloaded`, verbose);

                log('title', 'Moving Files');

                verboseExec(`mv SETUP/WB-Starter-${ unzippedDirName }/_source _source`, verbose);
                log('verbose', `moved _source`, verbose);

                verboseExec(`mv SETUP/WB-Starter-${ unzippedDirName }/_starter _starter`, verbose);
                log('verbose', `moved _starter`, verbose);

                verboseExec(`rm -rf SETUP`, verbose);
                log('verbose', `SETUP directory deleted`, verbose);

                log('title', 'Starting Install');

                const installCommand = `node ./_starter/install.js --handle='${ name }' ${ dev ? '--dev' : '' } ${ verbose ? '--verbose' : '' }`;

                if (verbose) {
                    verboseExec(installCommand, verbose);
                } else {
                    exec.spawnSync(installCommand, [], { stdio: 'inherit', shell: true });
                }

                log('app', `New WB-Starter Project, ${ name }, Created`);

                log('message', chalk.dim(`\n${_bye()}\n`));
            });
        } else {
            throw new Error("A directory of this name already exists. Please choose a different name.");
        }
    });
}

// download a file and run a callback
function downloadFromUrl(url, cb) {
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

function _bye() {
    // brought to you by: https://www.shortlist.com/entertainment/films/50-best-final-lines-in-movies/82044
    // exept the one quote... that guy was a f***ing idiot

    const lines = [
        `You met me at a very strange time in my life.`,
        `Louis, I think this is the beginning of a beautiful friendship.`,
        `Let me sleep.`,
        `Roads? Where we're going, we don't need roads!`,
        `Now, where was I?`,
        `Where we go from there is a choice I leave to you.`,
        `Ernest Hemingway once wrote, "The world is a fine place and worth fighting for." I agree with the second part.`,
        `This is Ripley, last survivor of the Nostromo, signing off.`,
        `We will hunt him down because he can take it. Because he's not our hero. He's a silent guardian. A watchful protector. A dark knight...`,
        `Why don't we just wait here for a little while... see what happens...`,
        `Hang on, lads; I've got a great idea.`,
        `You Maniacs! You blew it up! Ah, damn you! God damn you all to hell!`,
        `The greatest trick the devil ever pulled was convincing the world he did not exist. And like that... he is gone.`,
        `I'm da boss, I'm da boss, I'm da boss, I'm da boss, I'm da boss... I'm da boss, I'm da boss, I'm da boss, I'm da boss, I'm da boss, I'm da boss.`,
        `I'm not even gonna swat that fly. I hope they are watching. They'll see. They'll see and they'll know and they'll say, 'Why, she wouldn't even harm a fly'...`,
        `No matter where he is, I thought you should know what kind of man your father really was.`,
        `So long... partner.`,
        `I do wish we could chat longer, but I'm having an old friend for dinner...`,
        `I was cured all right!`,
        `You're not an asshole, Mark. You're just trying so hard to be.`,
        `The horror, the horror...`,
        `Still, things won't ever be the way they were before he came. But that's alright because if you hang onto the past you die a little every day. And for myself, I know I'd rather live.`,
        `Kevin, What Did You Do to My Room?`,
        `Some men get the world. Others get ex-hookers and a trip to Arizona.`,
        `I’m too old for this.`,
        `I'll be right here...`,
        `You know somethin', Utivich? I think this just might be my masterpiece.`,
        `The truth is...I am Iron Man.`,
        `Go ahead! I take your f***ing bullets! You think you kill me with bullets? I take your f***ing bullets! Go ahead!`,
        `You have no idea what I'm talking about, I'm sure. But don't worry: you will someday.`,
        `The unknown future rolls toward us. I face it, for the first time, with a sense of hope. Because if a machine, a Terminator, can learn the value of human life, maybe we can too.`,
        `Oh yes, I believe in friends. I believe we need them, but if one day you find that you just can't trust them anymore then what then? What then?`,
        `This is my gift, my curse. Who am I? I'm Spider-man.`,
        `I think we'll be OK here, Leon.`,
        `What about the person we show it to? What's happens to them?`,
        `Yo, Adrian, we did it. We did it.`,
        `A man’s got to know his limitations.`,
        `The name's Bond. James Bond.`,
        `When people ask me if Michael Sullivan was a good man, or if there was just no good in him at all, I always give the same answer. I just tell them, he was my father.`,
        `There have been tyrants and murderers and for a time they can seem invincible, but in the end they always fall. Think of it. Always.`,
        `And no matter what they did to build this city back up again ... for the rest of time ... it would be like nobody even knew we was ever here.`,
        `Oh, no! It wasn't the airplanes. It was Beauty killed the Beast.`,
        `Baby, you are gonna miss that plane.`,
        `One more thing, Sofie... is she aware her daughter is still alive?`,
        `This place makes me wonder... Which would be worse, to live as a monster, or to die as a good man?`,
        `We each owe a death - there are no exceptions - but, oh God, sometimes the Green Mile seems so long.`,
        `Well, nobody's perfect.`,
        `What a day. What a motherf***in' day.`,
        `Right after I got here, I ordered some spaghetti with marinara sauce and I got egg noodles and ketchup. I'm an average nobody. I get to live the rest of my life like a schnook.`
    ]
    return lines[Math.floor(Math.random()*lines.length)];
}

exports.run = run;