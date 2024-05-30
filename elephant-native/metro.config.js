// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const {createSentryMetroSerializer} = require('@sentry/react-native/dist/js/tools/sentryMetroSerializer');


/** @type {import('expo/metro-config').MetroConfig} */
let config = getDefaultConfig(__dirname);
config = {
    ...config,
    serializer: {
        customSerializer: createSentryMetroSerializer(),
    },
}
config.resolver.assetExts.push('cjs')

module.exports = config;
