import * as aes from 'crypto-js/aes';
import * as CryptoJS from 'crypto-js';


export const encryptText = (textToEncrypt, key='') => {
    if (key === '') key = 'A37u172sSFS9O9JNHs82u38djdncnvyz9';
    if (!textToEncrypt || textToEncrypt === '') return '';

    return aes.encrypt(textToEncrypt, key);
};


export const decryptText = (textToDecrypt, key='') => {
    if (key === '') key = 'A37u172sSFS9O9JNHs82u38djdncnvyz9';
    if (!textToDecrypt || textToDecrypt === '') return '';
    
    return aes.decrypt(textToDecrypt, key).toString(CryptoJS.enc.Utf8);
};