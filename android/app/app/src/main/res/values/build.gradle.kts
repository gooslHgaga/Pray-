plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.example.photo"
    compileSdk = 34   // تأكد من أن compileSdk حديث (مثلاً 34)

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_11.toString()
    }

    defaultConfig {
        applicationId = "com.example.photo"
        minSdk = 21               // مهم لحل مشكلة ML Kit
        targetSdk = 34            // استخدم آخر Target SDK
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("debug")

            // حل مشكلة R8 عبر تعطيل التصغير أو استخدام قواعد مخصصة
            minifyEnabled = false
            shrinkResources = false

            // إذا أردت إبقاء التصغير مفعّل أضف ملف proguard-rules.pro
            // proguardFiles(
            //     getDefaultProguardFile("proguard-android-optimize.txt"),
            //     "proguard-rules.pro"
            // )
        }
    }
}

flutter {
    source = "../.."
}
