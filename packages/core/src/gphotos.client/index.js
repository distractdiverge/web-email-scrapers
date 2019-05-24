// TODO: Extract this out into its own NodeJS package & Share It
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const getClient = (token) => {
    const PROTO_PATH = './http.proto';

    // Suggested options for similarity to existing grpc.load behavior
    return protoLoader.load(
        PROTO_PATH,
        {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        })
        .then(packageDefinition => grpc.loadPackageDefinition(packageDefinition))
        .then(protoDescriptor => protoDescriptor.http);
};

const listAlbums = (authToken) =>
    getClient(authToken)
        .then(client => client.albums.list());

module.exports = {
    getClient,
    listAlbums,
};