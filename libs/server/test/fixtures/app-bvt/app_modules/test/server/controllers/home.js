"use strict";

exports.index = async (ctx) => {
    await ctx.render('index', {title: 'Test.index', name: 'Swig'});
};