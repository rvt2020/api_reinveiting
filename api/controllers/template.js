// const apm = require('elastic-apm-node').start({
//     serverUrl: 'http://192.168.4.105:8200'
// });

// const template = async () => {
//     try {
//         throw new Error('FUE UN ERROR CONTROLADO');
//     } catch (error) {
//         console.log("CATCH");
//         apm.captureError(error)
//     }
// }

// module.exports = {
//     template
// }