module.exports = {
  client: {
    includes: ['./graphql/**/*.ts'],
    service: {
      name: 'playground-tokengating',
      url: 'http://ec2-18-141-168-145.ap-southeast-1.compute.amazonaws.com:8080/graphql',
      // optional disable SSL validation check
      skipSSLValidation: true,
    },
  },
}
