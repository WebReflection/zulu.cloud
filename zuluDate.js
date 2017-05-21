/*! (c) Andrea Giammarchi - ISC License */
var zuluDate = function (Date, time) {
  var
    now = new Date,
    getTime = now.getTime,
    timeFrom = getTime.bind ?
      getTime.call.bind(getTime) :
      function (date) {
        return getTime.call(date);
      },
    earlier = timeFrom(now)
  ;
  setInterval(function () {
    now = timeFrom(new Date);
    zuluDate = new Date(
      timeFrom(zuluDate) +
      (now - earlier)
    );
    earlier = now;
  }, 300);
  return new Date(time);
}(Date, 1);
