(function(ns){
  // Declarative page layouts. Each group renders a heading, a card grid (`items`)
  // and optional screenshot galleries (`galleries`).
  // A group's optional `app` lets a page be filtered with ?app=<name> (used by the landing page links).
  // items: { apk: app } | { web: app } | { link: href, title, desc }
  ns.PAGES = {
    home: { groups: [] },
    dev: { env: 'dev', steps: true, footer: 'footerApk', groups: [
      { app: 'student', title: 'grpStudent', badge: 'S', items: [{ apk: 'student' }] },
      { app: 'teacher', title: 'grpTeacher', badge: 'T', items: [{ apk: 'teacher' }, { web: 'teacher' }] },
      { app: 'admin', title: 'grpAdmin', badge: 'A', items: [{ web: 'admin' }] }
    ] },
    student: { env: 'prod', steps: true, footer: 'footerApk', groups: [
      { title: 'secApk', badge: 'APK', items: [{ apk: 'student' }] },
      { title: 'secShots', badge: 'IMG', galleries: [{ key: 'student', label: 'shotsApp', app: 'student' }] }
    ] },
    teacher: { env: 'prod', steps: true, footer: 'footerApk', groups: [
      { title: 'secApk', badge: 'APK', items: [{ apk: 'teacher' }] },
      { title: 'secWeb', badge: 'WEB', items: [{ web: 'teacher' }] },
      { title: 'secShots', badge: 'IMG', galleries: [
        { key: 'teacher-app', label: 'shotsApp', app: 'teacher' },
        { key: 'teacher-web', label: 'shotsWeb', app: 'teacher' }
      ] }
    ] },
    admin: { env: 'prod', footer: 'footerWeb', groups: [
      { title: 'secWeb', badge: 'WEB', items: [{ web: 'admin' }] }
    ] },
    prodHome: { env: 'prod', chooser: true, groups: [
      { items: [
        { link: '../egedunex-student/', title: 'homeStudent', desc: 'homeStudentDesc' },
        { link: '../egedunex-teacher/', title: 'homeTeacher', desc: 'homeTeacherDesc' },
        { link: '../egedunex-admin/', title: 'homeAdmin', desc: 'homeAdminDesc' }
      ] }
    ] }
  };
})(window.Edunex = window.Edunex || {});
