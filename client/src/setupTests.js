// jest-dom adds DOM matchers like toHaveTextContent() - see https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// CRA's bundled jsdom test environment predates the Web APIs some newer
// libraries (react-router v7) assume are globally available - polyfill them
// from Node's own implementations rather than pulling in an extra package
const { TextEncoder, TextDecoder } = require('util');
if (typeof global.TextEncoder === 'undefined') global.TextEncoder = TextEncoder;
if (typeof global.TextDecoder === 'undefined') global.TextDecoder = TextDecoder;
