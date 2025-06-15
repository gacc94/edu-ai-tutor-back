import { EnvConfigLoader } from './env/loader.config';

export default () => {
    const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

    const loader = new EnvConfigLoader({ environmentName: env });

    return loader.validateConfigAsync();
};
