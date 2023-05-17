const baseName = (str) => {
    const pos = str.lastIndexOf('.');
    return pos === -1 ? str : str.substring(0, pos);
};

export default baseName;