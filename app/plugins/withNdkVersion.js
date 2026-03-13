/**
 * Expo config plugin: override Android NDK version.
 *
 * NDK 27.1 (Expo SDK 55 default) has a clang ICE (internal compiler error)
 * when building react-native-reanimated's LayoutAnimationsProxy C++ templates.
 * NDK 28.x ships clang 19 which handles this correctly.
 */
const { withAppBuildGradle } = require('expo/config-plugins');

function withNdkVersion(config, ndkVersion = '28.2.13676358') {
  return withAppBuildGradle(config, (config) => {
    const contents = config.modResults.contents;
    // Replace the default ndkVersion line with our override
    config.modResults.contents = contents.replace(
      /ndkVersion\s+rootProject\.ext\.ndkVersion/,
      `// NDK 27.1 clang crashes on reanimated C++ templates — use 28.x\n    ndkVersion "${ndkVersion}"`
    );
    return config;
  });
}

module.exports = withNdkVersion;
