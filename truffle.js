module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8543,
            network_id: "*" // Match any network id
        },
        test: {
            host: "localhost",
            port: 8544,
            network_id: 3
        },
        main: {
            host: "localhost",
            port: 8545,
            network_id: "*"
        }
    }
};
