
exports.send = async function ({socket}) {
    socket.emit('welcome', "What's up?");
};