// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const vex = require('vex-js');
const shell = require('electron').shell;
const settings = require('electron-settings');
// const fsAsync = require('fs').promises;

let timesClicked = 0;

vex.registerPlugin(require('vex-dialog'));
vex.defaultOptions.className = 'vex-theme-os';
const vexAsync = generateVexAsync();

function generateVexAsync() {
    // TODO: DRY this up
    return {
        alert: (opts) => (new Promise(resolve => {
            if (typeof opts === 'string') {
                opts = { message: opts };
            }
            opts.callback = resolve;
            vex.dialog.alert(opts);
        })),
        confirm: (opts) => (new Promise(resolve => {
            if (typeof opts === 'string') {
                opts = { message: opts };
            }
            opts.callback = resolve;
            vex.dialog.confirm(opts);
        })),
        prompt: (opts) => (new Promise(resolve => {
            if (typeof opts === 'string') {
                opts = { message: opts };
            }
            opts.callback = resolve;
            vex.dialog.prompt(opts);
        })),
        open: (opts) => (new Promise(resolve => {
            if (typeof opts === 'string') {
                opts = { message: opts };
            }
            opts.callback = resolve;
            vex.dialog.open(opts);
        })),
    };
}

document.getElementById('increment-clicks-button').addEventListener('click', e => {
    e.preventDefault();
    timesClicked++;
    document.getElementById('times-clicked-count').innerText = timesClicked;
    return false;
});

document.getElementById('prompt-open').addEventListener('click', async e => {
    e.preventDefault();
    const promptResponse = await vexAsync.prompt('Enter something here!');
    document.getElementById('prompt-response').innerText = promptResponse;
    return false;
});

document.getElementById('link-open').addEventListener('click', e => {
    e.preventDefault();
    shell.openExternal('https://electronjs.org');
    return false;
});

document.getElementById('settings-value').innerText = settings.get('demo.settingsValueStr') || '[not set]';

document.getElementById('settings-open').addEventListener('click', async e => {
    e.preventDefault();
    const currSettingValue = settings.get('demo.settingsValueStr') || '';
    const promptResponse = await vexAsync.prompt({message: 'Change the setting and it will be saved across restarts', placeholder: currSettingValue});
    if (promptResponse === false) {
        // Do not update the settings value is they chose "Cancel"
        return;
    }
    settings.set('demo.settingsValueStr', promptResponse);
    document.getElementById('settings-value').innerText = promptResponse || '[not set]';
    return false;
});
