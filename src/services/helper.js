const startScript = (params = {}) => {
    
    
    console.log('\x1b[32m%s\x1b[0m', " _____                  _                  _____             _");
    console.log('\x1b[32m%s\x1b[0m', "|_   _|_ _ ___ _   _   / \\   _ __ ___  ___|  ___|__  ___  __| |")
    console.log('\x1b[32m%s\x1b[0m', "  | |/ _` / __| | | | / _ \\ | '_ ` _ \\|_  / |_ / _ \\/ _ \\/ _` |");
    console.log('\x1b[32m%s\x1b[0m', "  | | (_| \\__ \\ |_| |/ ___ \\| | | | | |/ /|  _|  __/  __/ (_| |");
    console.log('\x1b[32m%s\x1b[0m', "  |_|\\__,_|___/\\__, /_/   \\_\\_| |_| |_/___|_|  \\___|\\___|\\__,_|");
    console.log('\x1b[32m%s\x1b[0m', "               |___/")
    console.log('');
    console.log("Created by: \x1b[36mSang 'Tasy' Nguyen\x1b[0m")
    console.log('Email:      \x1b[4m\x1b[36mthaisang.nguyen3894@gmail.com\x1b[0m\x1b[24m');
    console.log('Github:     \x1b[4m\x1b[36mhttps://github.com/tasynguyen3894\x1b[0m\x1b[24m');
    console.log('');
    console.log('---------------------------------------');
    console.log(`App is running at PORT \x1b[4m${params.PORT || 3000}\x1b[24m`);
}

module.exports = {
    startScript: startScript
}