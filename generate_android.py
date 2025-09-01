import os

files = {
    # gradle wrapper
    "android/gradlew": """#!/bin/sh
DIR="$( cd "$( dirname "$0" )" && pwd )"
exec "$DIR/gradle/wrapper/gradle-wrapper.jar" "$@"
""",
    "android/gradlew.bat": """@ECHO OFF
SET DIR=%~dp0
java -jar "%DIR%\\gradle\\wrapper\\gradle-wrapper.jar" %*
""",
    "android/gradle/wrapper/gradle-wrapper.properties": """distributionUrl=https\\://services.gradle.org/distributions/gradle-8.0.2-bin.zip
""",

    # settings.gradle
    "android/settings.gradle": "include ':app'\nrootProject.name = 'MyApp'\n",

    # build.gradle (root)
    "android/build.gradle": """buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.0.2'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}
""",

    # gradle.properties
    "android/gradle.properties": "org.gradle.jvmargs=-Xmx2048m\n",

    # app/build.gradle
    "android/app/build.gradle": """apply plugin: 'com.android.application'

android {
    namespace "com.example.myapp"
    compileSdkVersion 34

    defaultConfig {
        applicationId "com.example.myapp"
        minSdkVersion 23
        targetSdkVersion 34
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation 'com.google.android.material:material:1.9.0'
}
""",

    # proguard
    "android/app/proguard-rules.pro": "// Proguard rules\n",

    # Manifest
    "android/app/src/main/AndroidManifest.xml": """<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myapp">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.AppCompat.Light.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
""",

    # MainActivity
    "android/app/src/main/java/com/example/myapp/MainActivity.java": """package com.example.myapp;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {}
"""
}

# إنشاء الملفات
for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content)

print("✅ تم إنشاء مجلد android/ بالكامل (مع gradle wrapper + manifest + mainactivity)!")
