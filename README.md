# React Native Android Gotchas

I recently released an Android app on Google Play using React Native. The app in question is called [Grade School Trivia Quest](https://play.google.com/store/apps/details?id=com.triviaquest) if you're interested. Uploading the entire codebase to GitHub would be giving too much proprietary data away, but I at least wanted to document some of the hurdles and gotchas I ran into.

Note: I initially set up the project using the React Native CLI, following the guide at: <https://facebook.github.io/react-native/docs/getting-started>

## Development Commands

I found it helpful to add a few new commands to the [package.json](./package.json) file to speed up development:

* `"emulator": "C:\\path\\to\\Android\\Sdk\\emulator\\emulator.exe -avd \"Pixel_2_API_28\""`

  * This allowed me to launch an emulated Android device outside of Android Studio so I didn't have to boot it up every time. Just replace `Pixel_2_API_28` with whatever you named your test device.

* `"build": "cd android && bash ./gradlew bundleRelease"`

  * Builds an `app.aab` file in the directory `/android/app/build/outputs/bundle/release`. This is the file that you would upload to Google Play.

* `"build-apk": "cd android && bash ./gradlew assembleRelease"`

  * For other marketplaces like Amazon, you probably need an APK file instead of a bundle file. This command will generate an `app-release.apk` file in the directory `/android/app/build/outputs/apk/release`.

* `"clean": "rm -rf ./android/app/build/*"`

  * Deletes all of the files in the build folder. Maybe this was just a placebo effect, but sometimes I couldn't get my app to run for the first time until I cleared out the old build files.

* `"check": "adb devices"`

  * Occasionally, my app would stop loading my changes, the reason being that my device had disconnected without me realizing it. A quick `adb devices` check will display which devices are still connected to your computer, if any.

## Custom Fonts

If you want to use custom fonts in your app, you can include the `.ttf` files in your root directory somewhere (I put all of my files in a `src` directory). However, you'll need to update or create a [react-native.config.js](./react-native.config.js) file to look like this:

```js
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ["./src/fonts/"] // or wherever you put the font files
};
```

Then run the command `react-native link` to automatically copy these assets to the `/android/app/src/main/assets/fonts` directory.

## Using Styles

On the topic of fonts, one annoying thing about React Native is that you can't set a global font style. You have to set the font on each individual `<Text>` component. This is why I found it helpful to create my own `<TextView>` component that does this for me.

For example:

```js
const TextView = (props) => {
  return (
    <Text {...props} style={[{fontFamily:"OpenSans-Regular"}, props.style]}>
      {props.children}
    </Text>
  );
};
```

I'm an old fuddy-duddy when it comes to CSS, though, and preferred to write all of my styles in a separate [styles.js](./src/styles.js) file to mimic a CSS style sheet as much as possible.

In this file, I wrote a function to calculate responsive fonts, since React Native doesn't support this yet:

```js
const perc = (x) => {
  return Math.round(x / 100 * Dimensions.get("window").width);
};
```

## Android XML Files

Some things you simply can't control through React Native and have to do things the truly native way. For instance, if you want to force portrait mode, you need to update the [AndroidManifest.xml](./android/app/src/main/AndroidManifest.xml) file located at `/android/app/src/main` to look like the following:

```xml
<activity
  android:name=".MainActivity"
  android:label="@string/app_name"
  android:screenOrientation="portrait"
  android:configChanges="keyboard|keyboardHidden|orientation|screenSize"
  android:windowSoftInputMode="adjustResize">
```

Another tweak I wanted to make was to change the default background color. This would prevent that annoying white screen flicker that happens in between the native app loading and the root React component mounting. To do this, I first had to add a [colors.xml](./android/app/src/main/res/values/colors.xml) file to define the color:

```xml
<resources>
    <color name="background">#ff2e2d</color>
</resources>
```

Then update [styles.xml](./android/app/src/main/res/values/styles.xml) to use this color variable:

```xml
<resources>
  <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
    <item name="android:textColor">#000000</item>
    <item name="android:windowBackground">@color/background</item>
  </style>
</resources>
```

Both files are located in `/android/app/src/main/res/values`.

## App Icons

While we're in the `res` directory, this is also where you can plop in your own app icons. Different image sizes are required for each resolution (`mipmap-hdpi`, etc.), including a square-shaped icon and a round icon.

Fortunately, there's a great tool by GitHub user [romannurik](https://github.com/romannurik/AndroidAssetStudio) that will help you generate all of these images in one swoop.

## Gradle Files

Finally, there's the issue of building the darn thing. The React Native docs offer some guidance on [generating an upload key](https://facebook.github.io/react-native/docs/signed-apk-android), but their instructions leave a lot to be desired.

Assuming you were able to generate a key, you'll still need to update your [build.gradle](./android/app/build.gradle) file located at `/android/app`. By default, there is only a `debug` option listed under `signingConfigs`. Update this section to look like the following:

```
signingConfigs {
  debug {
    storeFile file('debug.keystore')
    storePassword 'android'
    keyAlias 'androiddebugkey'
    keyPassword 'android'
  }
  release {
    storeFile file('your.keystore')
    storePassword 'yourPassword'
    keyAlias 'yourAlias'
    keyPassword 'yourPassword'
  }
}
```

Then under `buildTypes`, you'll need to update the `release` config to use the correct `signingConfig` value:

```
buildTypes {
  debug {
    signingConfig signingConfigs.debug
  }
  release {
    signingConfig signingConfigs.release
    minifyEnabled enableProguardInReleaseBuilds
    proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
  }
}
```

One last thing to be aware of... Every time you want to upload a new version to Google Play, you have to update the `versionCode` in your app. Otherwise, Google Play won't accept it as a new version.

This `versionCode` property is in the same `build.gradle` file, listed under `defaultConfig`. Just increment it by one each time you want to upload a new version of your app.

_Good luck!_

![""](./android/app/src/main/res/mipmap-hdpi/ic_launcher.png)