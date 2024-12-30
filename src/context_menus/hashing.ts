import crypto from 'crypto';


export function getLastFmApiSig(data: {[key: string]: any}, secret: string): string {
    // Sort keys alphabetically
    const sortedKeys = Object.keys(data).sort();
    
    // Concatenate parameters in name+value format
    const concatenatedString = sortedKeys.reduce((acc, key) => {
        // Ensure values are properly encoded
        const value = encodeURIComponent(data[key].toString());
        return acc + key + value;
    }, '');

    // Append secret
    const stringToHash = concatenatedString + secret;
    
    // Generate MD5 hash
    return crypto.createHash('md5')
        .update(stringToHash)
        .digest('hex');
}