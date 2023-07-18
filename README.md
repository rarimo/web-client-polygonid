# Distributed Lab react started template

## Project setup
```
yarn | yarn install
```

### Compiles and hot-reloads for development
```
yarn start
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Run unit tests
```
yarn test
```

### Lints release/release candidate version
```
yarn rsc %release-version%
```

### Build docker image with version
```
 docker build --no-cache --progress=plain --build-arg BUILD_VERSION=1.0.0-rc.0 -t react-template .
```

### Env configuration
To setup working contracts, copy .env.example to .env and fill it with your data

set contract addresses with following format:
```yaml
VITE_QUERY_VERIFIER_CONTRACT_ADDRESS_[CHAIN_NAME]=0x000000000
VITE_VERIFIED_SBT_CONTRACT_ADDRESS_[CHAIN_NAME]=0x000000000
```

where CHAIN_NAME is one of the [SUPPORTED_CHAINS](./src/config.ts)

then set currently used chain with:
```yaml
VITE_DEFAULT_CHAIN=SEPOLIA
```

## Some additional features

### JsonApi lib

[@distributedlab/jac](https://distributed-lab.github.io/web-kit/modules/_distributedlab_jac.html)

### Web3 provider wrapper lib

[@distributedlab/w3p](https://distributed-lab.github.io/web-kit/modules/_distributedlab_w3p.html)

### Utils, tools, helpers, ...etc

[@distributedlab/tools](https://distributed-lab.github.io/web-kit/modules/_distributedlab_tools.html)

## License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE) file for details
