module.exports = {
    apps: [{
        name: "api-reinventing-js",
        script: "./app.js",
        instances: 4,
        exec_mode: "cluster",
        watch: true,
        log_file: "~/.pm2/logs/api-reinventing-js-outerr.log",
        out_file: "NULL", // ~/.pm2/logs/api-reinventing-js-out.log
        error_file: "~/.pm2/logs/api-reinventing-js-error.log",
        combine_logs: true,
        merge_logs: true,
        env_production: {
            NODE_ENV: "production",
            NODE_PATH: "./"
        },
        env_development: {
            NODE_ENV: "development",
            NODE_PATH: "./"
        }
    }]
};