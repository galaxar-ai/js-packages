exports.echo = async function (ctx, data) {
    console.log('echo called', data);
    return data;
};
