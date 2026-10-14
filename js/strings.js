(function(ns){
  var common = {
    en: {
      langBtn: 'العربية',
      s1t: 'Download', s1d: 'Tap the APK for your app below.',
      s2t: 'Allow installs', s2d: 'Android will ask to allow installs from this source once.',
      s3t: 'Install / update', s3d: 'If Chrome asks “Keep file?”, tap Keep. Then open the file. Installing over an existing app updates it and keeps your data.',
      secApk: 'Android app', secWeb: 'Web app', secShots: 'Screenshots',
      grpStudent: 'Student app', grpTeacher: 'Teacher app & web', grpAdmin: 'Admin panel',
      shotsApp: 'Mobile app', shotsWeb: 'Web app',
      shotsSoon: 'Screenshots will appear here soon.', shotAlt: '{name} screenshot {n}',
      student: 'Student App', teacher: 'Teacher App', admin: 'Admin Panel',
      webTitle_teacher: 'Teacher web app', webTitle_admin: 'Admin panel (web)',
      envDev: 'Dev', envProd: 'Prod',
      checking: 'Checking…', dlApk: 'Download APK', openWeb: 'Open web app', openPage: 'Open',
      notYet: 'Not available yet', unavailable: 'Unavailable',
      noBuild: 'No build published yet. It appears here after the next release.',
      webNotSet: 'This web link hasn’t been set yet.', webError: 'Couldn’t load the web link.',
      errRate: 'GitHub API rate limit hit — try again shortly.',
      errStatus: 'Couldn’t check GitHub (status {n}).', errNet: 'Network error reaching GitHub.',
      checkingGh: 'Checking GitHub…', lastChecked: 'Last checked {t}',
      rateLimited: 'Some checks were rate-limited — refresh in a minute.',
      refresh: 'Refresh', justNow: 'just now',
      footerApk: 'iOS builds aren’t distributed this way yet.', footerWeb: 'The admin panel is web-only.'
    },
    ar: {
      langBtn: 'English',
      s1t: 'التحميل', s1d: 'اضغط على ملف APK الخاص بتطبيقك في الأسفل.',
      s2t: 'السماح بالتثبيت', s2d: 'سيطلب منك أندرويد السماح بالتثبيت من هذا المصدر مرة واحدة.',
      s3t: 'التثبيت / التحديث', s3d: 'إذا سألك Chrome «الاحتفاظ بالملف؟» اضغط «احتفظ». ثم افتح الملف. التثبيت فوق التطبيق الحالي يحدّثه ويحتفظ ببياناتك.',
      secApk: 'تطبيق أندرويد', secWeb: 'تطبيق الويب', secShots: 'لقطات الشاشة',
      grpStudent: 'تطبيق الطالب', grpTeacher: 'تطبيق المعلم والويب', grpAdmin: 'لوحة الإدارة',
      shotsApp: 'تطبيق الجوال', shotsWeb: 'تطبيق الويب',
      shotsSoon: 'ستظهر لقطات الشاشة هنا قريبًا.', shotAlt: 'لقطة شاشة {name} رقم {n}',
      student: 'تطبيق الطالب', teacher: 'تطبيق المعلم', admin: 'لوحة الإدارة',
      webTitle_teacher: 'تطبيق المعلم على الويب', webTitle_admin: 'لوحة الإدارة (ويب)',
      envDev: 'تطوير', envProd: 'رسمي',
      checking: 'جارٍ التحقق…', dlApk: 'تحميل APK', openWeb: 'فتح تطبيق الويب', openPage: 'فتح',
      notYet: 'غير متاح حاليًا', unavailable: 'غير متاح',
      noBuild: 'لم يتم نشر نسخة بعد. ستظهر هنا بعد الإصدار القادم.',
      webNotSet: 'لم يتم تحديد هذا الرابط بعد.', webError: 'تعذّر تحميل رابط الويب.',
      errRate: 'تم تجاوز حد طلبات GitHub — حاول مرة أخرى بعد قليل.',
      errStatus: 'تعذّر الاتصال بـ GitHub (الحالة {n}).', errNet: 'خطأ في الشبكة أثناء الاتصال بـ GitHub.',
      checkingGh: 'جارٍ التحقق من GitHub…', lastChecked: 'آخر تحقق: {t}',
      rateLimited: 'تم تقييد بعض الطلبات — حدّث الصفحة بعد دقيقة.',
      refresh: 'تحديث', justNow: 'الآن',
      footerApk: 'نسخ iOS غير متاحة بهذه الطريقة حاليًا.', footerWeb: 'لوحة الإدارة تعمل على الويب فقط.'
    }
  };

  var pages = {
    en: {
      title_dev: 'EDUNEX Development Builds', h1_dev: 'Development builds',
      lede_dev: 'Latest development builds: student app, teacher app and web, and the admin panel. For testing only — may change often.',
      title_student: 'EDUNEX Student App', h1_student: 'Student app',
      lede_student: 'Download the EDUNEX student app for Android and preview how it looks. Bookmark this page — when an update is released, install the new APK over the old one.',
      title_teacher: 'EDUNEX Teacher App & Web', h1_teacher: 'Teacher app & web',
      lede_teacher: 'Download the EDUNEX teacher app for Android or open the teacher web app, and preview both.',
      title_admin: 'EDUNEX Admin Panel', h1_admin: 'Admin panel',
      lede_admin: 'The EDUNEX admin panel (production) runs in the browser. Use the link below to open it.',
      title_prodHome: 'EDUNEX Production', h1_prodHome: 'Production',
      lede_prodHome: 'Choose what you want to open.',
      homeStudent: 'Student app', homeStudentDesc: 'Android APK and screenshots.',
      homeTeacher: 'Teacher app & web', homeTeacherDesc: 'Android APK, web app and screenshots.',
      homeAdmin: 'Admin panel', homeAdminDesc: 'Open the production admin panel.',
      title_home: 'EDUNEX Stores', h1_home: 'EDUNEX app store',
      lede_home: 'Please use the download link you were given.'
    },
    ar: {
      title_dev: 'EDUNEX – نسخة التطوير', h1_dev: 'نسخة التطوير',
      lede_dev: 'أحدث نسخ التطوير: تطبيق الطالب، وتطبيق المعلم والويب، ولوحة الإدارة. للاختبار فقط — قد تتغير كثيرًا.',
      title_student: 'EDUNEX – تطبيق الطالب', h1_student: 'تطبيق الطالب',
      lede_student: 'حمّل تطبيق الطالب لأندرويد واطّلع على شكله. احفظ هذه الصفحة في المفضلة — عند صدور تحديث ثبّت ملف APK الجديد فوق القديم.',
      title_teacher: 'EDUNEX – تطبيق المعلم والويب', h1_teacher: 'تطبيق المعلم والويب',
      lede_teacher: 'حمّل تطبيق المعلم لأندرويد أو افتح تطبيق المعلم على الويب، واطّلع على شكل كليهما.',
      title_admin: 'EDUNEX – لوحة الإدارة', h1_admin: 'لوحة الإدارة',
      lede_admin: 'لوحة إدارة EDUNEX (النسخة الرسمية) تعمل من المتصفح. استخدم الرابط في الأسفل لفتحها.',
      title_prodHome: 'EDUNEX – النسخة الرسمية', h1_prodHome: 'النسخة الرسمية',
      lede_prodHome: 'اختر ما تريد فتحه.',
      homeStudent: 'تطبيق الطالب', homeStudentDesc: 'ملف APK للأندرويد ولقطات الشاشة.',
      homeTeacher: 'تطبيق المعلم والويب', homeTeacherDesc: 'ملف APK وتطبيق الويب ولقطات الشاشة.',
      homeAdmin: 'لوحة الإدارة', homeAdminDesc: 'افتح لوحة الإدارة الرسمية.',
      title_home: 'متجر EDUNEX', h1_home: 'متجر تطبيقات EDUNEX',
      lede_home: 'من فضلك استخدم رابط التحميل الذي وصلك.'
    }
  };

  ns.strings = {};
  ['en', 'ar'].forEach(function(code){
    ns.strings[code] = Object.assign({}, common[code], pages[code]);
  });
})(window.Edunex = window.Edunex || {});
