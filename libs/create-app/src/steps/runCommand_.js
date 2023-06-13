const { cmd } = require("@genx/sys");
const { _ } = require("@genx/july");

module.exports = async (app, workingPath, command, treatErrorAsInfo) => {
    const lastWd = process.cwd();
    let cwdChanged = false;

    if (workingPath !== lastWd) {
        process.chdir(workingPath);
        cwdChanged = true;
    }   

    app.log('info', command);       

    try {
        const [ program, ...args ] = command.split(' ');

        await cmd.runLive_(program, args, data => {
            let output = data.toString();
            
            if (output.endsWith('\r\n')) {
                output = output.slice(0, -2);
            } else if (output.endsWith('\n')) {
                output = output.slice(0, -1);
            }

            if (_.trimStart(output).substring(0, 4).toLocaleLowerCase() === 'warn') {
                app.log('warn', output);
            } else {
                app.log('info', output);
            }            
        }, data => {
            if (treatErrorAsInfo) {
                app.log('info', data.toString());
            } else {
                app.log('error', data.toString());
            }            
        });
    } finally {
        if (cwdChanged) {
            process.chdir(lastWd);    
        }        
    }       
}