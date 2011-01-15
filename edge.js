$(function() {
  var SpatialFiltering, convert, ctx_convert, ctx_original, getPixel, height, img, original, setPixel, toGrayscale, width;
  getPixel = function(ctx, x, y) {
    var pixelData;
    pixelData = ctx.getImageData(x, y, 1, 1).data;
    return [pixelData[0], pixelData[1], pixelData[2]];
  };
  toGrayscale = function(r, g, b) {
    return Math.floor(r * 0.299) + Math.floor(g * 0.587) + Math.floor(b * 0.114);
  };
  SpatialFiltering = function(grayImage, height, width, filter, size_f) {
    var from, i, init, j, m, n, resultImage, sum, to, _ref, _ref2;
    init = Math.floor(size_f / 2);
    from = -init;
    to = init;
    resultImage = new Array(height * width);
    for (i = init, _ref = height - init; (init <= _ref ? i < _ref : i > _ref); (init <= _ref ? i += 1 : i -= 1)) {
      for (j = init, _ref2 = width - init; (init <= _ref2 ? j < _ref2 : j > _ref2); (init <= _ref2 ? j += 1 : j -= 1)) {
        sum = 0.0;
        for (n = from; (from <= to ? n <= to : n >= to); (from <= to ? n += 1 : n -= 1)) {
          for (m = from; (from <= to ? m <= to : m >= to); (from <= to ? m += 1 : m -= 1)) {
            sum += grayImage[(i + n) * width + j + m] * filter[(n + init) * size_f + m + init];
          }
        }
        resultImage[i * width + j] = Math.floor(Math.abs(sum));
      }
    }
    return resultImage;
  };
  setPixel = function(ctx, x, y, r, g, b, a) {
    var pixelImage, _ref;
    pixelImage = ctx.createImageData(1, 1);
    [].splice.apply(pixelImage.data, [0, 4].concat(_ref = [r, g, b, a])), _ref;
    return ctx.putImageData(pixelImage, x, y);
  };
  width = 256;
  height = 256;
  original = $("#original").get(0);
  ctx_original = original.getContext('2d');
  convert = $("#convert").get(0);
  ctx_convert = convert.getContext('2d');
  img = new Image();
  img.src = "./images/lena.png";
  img.onload = function() {
    return ctx_original.drawImage(img, 0, 0);
  };
  $("#original").click(function() {
    var I, b, filter, g, grayImage, r, resultImage, x, y, _ref, _results;
    grayImage = new Array(width * height);
    for (y = 0; (0 <= height ? y < height : y > height); (0 <= height ? y += 1 : y -= 1)) {
      for (x = 0; (0 <= width ? x < width : x > width); (0 <= width ? x += 1 : x -= 1)) {
        _ref = getPixel(ctx_original, x, y), r = _ref[0], g = _ref[1], b = _ref[2];
        grayImage[y * width + x] = toGrayscale(r, g, b);
      }
    }
    filter = [1, 0, -1, 1, 0, -1, 1, 0, -1];
    resultImage = SpatialFiltering(grayImage, height, width, filter, 3);
    _results = [];
    for (y = 0; (0 <= height ? y < height : y > height); (0 <= height ? y += 1 : y -= 1)) {
      _results.push((function() {
        var _results;
        _results = [];
        for (x = 0; (0 <= width ? x < width : x > width); (0 <= width ? x += 1 : x -= 1)) {
          I = resultImage[y * width + x];
          _results.push(setPixel(ctx_convert, x, y, I, I, I, 255));
        }
        return _results;
      })());
    }
    return _results;
  });
})
