import benchmark_ from './benchmark';

const text = 'fjfjieofjain81289ncncsldmoqe8hfdoaehflanflui3hodfannfka38ye89ohcfnab1t6ugdwoejmncalnfalfjioewyuhfqwi';

console.log(text.length - text.replaceAll('f', '').length);

const testees = {
    split: () => text.split('f').length - 1,
    match: () => [...text.matchAll(/f/g)].length,
    //search: () => text.search(/f/g),
    replace: () => text.length - text.replaceAll('f', '').length,
    countOfChar: () => {
        let l = text.length;
        let count = 0;
        const f = 'f';
        for (let i=0; i<l; count+=+(f ===text[i++]));
        return count;
    } 
};

benchmark_(testees).then(() => {
    console.log('done');
});
