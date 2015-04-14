var gulp         = require('gulp'),
    clean        = require('gulp-clean'),
    compass      = require('gulp-compass'),
    autoprefixer = require('gulp-autoprefixer'),
    jade         = require('gulp-jade'),
    notify       = require('gulp-notify'),
    plumber      = require('gulp-plumber'),
    changed      = require('gulp-changed'),
    svgstore     = require('gulp-svgstore'),
    svgmin       = require('gulp-svgmin'),
    svgSprite    = require('gulp-svg-sprite'),
    svg2png      = require('gulp-svg2png'),
    browserSync  = require('browser-sync'),
    htmlmin      = require('gulp-htmlmin'),
    runSequence  = require('gulp-run-sequence'),
    path         = require('path'),
    argv         = require('yargs').argv;


//webserver
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './'
            // index: 'index.html'
        },
        files: ["www/css/*.css", "www/*.html", "www/js/**/*.js"],
        port: 8080,
        open: false,
        notify: false,
        ghostMode: false
    });
});

//jade
gulp.task('jade', function() {
    return gulp.src('src/jade/*.jade')
        .pipe(plumber({errorHandler: notify.onError(function(error){return error.message;})}))
        .pipe(changed('./', {extension: '.html'}))
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest('./www'));
});

//compile all jade files
gulp.task('jade-all', function() {
    return gulp.src('src/jade/*.jade')
        .pipe(plumber({errorHandler: notify.onError(function(error){return error.message;})}))
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest('./www'));
});

//compass
gulp.task('compass', function() {
    return gulp.src('src/sass/**/*.sass')
        .pipe(plumber({errorHandler: notify.onError(function(error){return error.message;})}))
        .pipe(compass({
            project: path.join(__dirname, ''),
            sass: 'src/sass',
            image: 'src/img',
            config_file: 'config.rb',
            http_path: '/',
            http_images_path: '/img/',
            http_stylesheets_path: '/css/',
            css: 'www/css',
            generated_images_path: 'www/img',
            relative: true,
            //debug: true,
            environment: argv.production ? 'production' : 'development'
        }));
        //.pipe(autoprefixer({
        //    browsers: ['last 4 versions', 'ie 8'],
        //    cascade: false
        //}))
        //.pipe(gulp.dest('www/css'));
});


//svg sprite
// gulp.task('svgsprite', function() {
//     return gulp.src('img/svg/*.svg')
//         .pipe(svgmin())
//         .pipe(svgstore({ fileName: 'icons.svg', prefix: 'icon-' }))
//         .pipe(gulp.dest('img/'));
// });

gulp.task('svgSprite', function() {
    return gulp.src('src/img/svg/icons/*.svg')
        .pipe(svgmin())
        .pipe(svgSprite({
            svg: {
                sprite: 'sprites/sprite.svg'
            },
            templates: {
                css: require('fs').readFileSync('sass/lib/sprite-template.scss', "utf-8")
            },
            cssFile: '../sass/_svg-sprite.sass',
            // selector: 'icon-%f',
            svgPath: '../img/sprites/%f',
            pngPath: '../img/sprites/%f',
            padding: 10
        }))
        .pipe(gulp.dest('src/img'));
});

gulp.task('pngSprite', function() {
    return gulp.src('src/img/sprites/*.svg')
        .pipe(svg2png())
        .pipe(gulp.dest('src/img/sprites'));
});

gulp.task('minify', function() {
  return gulp.src('./www/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./www'))
});

// watch
gulp.task('watch', function() {
    gulp.watch('src/sass/**/*', ['compass']);
    gulp.watch('src/jade/**/*.jade', ['jade']);
    gulp.watch('src/jade/includes/*.jade', ['jade-all']);
    gulp.watch('src/jade/layouts/*.jade', ['jade-all']);
    gulp.watch('src/js/**/*.js', ['copy-script']);
    // gulp.watch('img/svg/icons/*.svg', ['svgSprite', 'pngSprite']);
});

gulp.task('build',function (cb) {
    var sequence = ['clean',['copy','copy-script', 'jade', 'compass']];
    if (argv.production) sequence.push('minify');
    sequence.push(cb);
    return runSequence.apply(this, sequence);
});
gulp.task('copy-script', function () {
    return gulp.src('src/js/**/*', {base: './src'})
        .pipe(gulp.dest('./www'));
});
gulp.task('copy', function () {
    return gulp.src('src/{bower,fonts,img}/**/*', {base: './src'})
        .pipe(gulp.dest('./www'));
});
gulp.task('clean', function () {
    return gulp.src(['www','.sass-cache'], {read: false})
        .pipe(clean());
});
gulp.task('default',['build', 'browser-sync', 'watch'], function() {});