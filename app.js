var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 3000;
server.listen(port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var current_slide = 0;  // 現在のスライド番号を保持

// クライアントから接続があった時
io.sockets.on('connection', function (socket) {

  // コネクションが確立されたら'connected'メッセージを送信する
  console.log("[connection] has received current_slide:[" + current_slide + "]");
  socket.emit('connected', {value: current_slide});

  // メッセージ送信（送信者にも送られる）
  socket.on("C_to_S_message", function (data) {
    console.log("[C_to_S_message] has received");
    current_slide = data.value;
    io.sockets.emit("S_to_C_message", {value: current_slide});
  });

  // ブロードキャスト（送信者以外の全員に送信）
  socket.on("C_to_S_broadcast", function (data) {
    console.log("[C_to_S_broadcast] has received");
    current_slide = data.value;
    socket.broadcast.emit("S_to_C_message", {value: current_slide});
  });

  // 切断したときに送信
  socket.on("disconnect", function () {
    console.log("[disconnect] has received");
  });
});

module.exports = app;

