const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// WatermelonDB requires cjs extension support
config.resolver.sourceExts.push('cjs');

// Support for WatermelonDB SQLite adapter
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts.push('svg');

module.exports = config;
