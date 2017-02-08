/**
 * Created by baocheng on 2017/2/8.
 */
function convertToStarsArray(stars) {
    var fullStarNum = stars.toString().substring(0, 1);
    var halfStarNum = stars.toString().substring(1, 2);
    var array = [];
    for (var i = 0; i < fullStarNum.length; i++) {
        array.push(1);
    }
    var temp = halfStarNum > 0 ? 2 : 0;
    array.push(temp);
    var currentLength = array.length;
    for (var j = 0; j < 5 - currentLength; j++) {
        array.push(0);
    }
    return array;
}

module.exports = {
    convertToStarsArray: convertToStarsArray
}