var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var fs = require('fs');
var archiver = require('archiver');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.get('/downloadF', function (req, res) {
  let zipPath = './public/example.zip';
  let sourcePath = './public/css/font-awesome-4.7.0/**';
  if(fs.existsSync(zipPath)){
    fs.unlinkSync(zipPath);
  }
  zip(zipPath,sourcePath,function(){
     res.download(zipPath);
  });

})
function zip(zipPath,sourcePath){
  let output = fs.createWriteStream(zipPath);
  let archive = archiver('zip');
  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });
  output.on('end', function () {
    console.log('Data has been drained');
  });

  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err;
    }
  });
  archive.on('error', function (err) {
    throw err;
  });
  archive.pipe(output);
  // 创建的输入流中可以加入文件等。。。
  // var file1 = __dirname + '/file1.txt';
  // archive.append(fs.createReadStream(sourcePath), { name: 'font-awesome' });
  // archive.append('string cheese!', { name: 'file2.txt' });
  // var buffer3 = Buffer.from('buff it!');
  // archive.append(buffer3, { name: 'file3.txt' });
  // archive.file('file1.txt', { name: 'file4.txt' });
  // archive.directory('subdir/', 'new-subdir');
  // archive.directory('subdir/', false);
  archive.glob(sourcePath);
  archive.finalize();

}

module.exports = app;
