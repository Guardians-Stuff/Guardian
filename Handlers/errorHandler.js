async function processErrorHandler() {
    process.on('unhandledRejection', async (err) => {
        console.error(err)
    });

    process.on('uncaughtException', async (err) => {
        console.error(err)
    });
};

module.exports = { processErrorHandler }