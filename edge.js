$(function() {
  var SpatialFiltering, canvas, canvas_to, context, context_to, getPixel, height, img, setPixel, toGrayscale, width;
  getPixel = function(ctx, x, y) {
    var pixelData;
    pixelData = ctx.getImageData(x, y, 1, 1).data;
    return [pixelData[0], pixelData[1], pixelData[2]];
  };
  toGrayscale = function(r, g, b) {
    return Math.floor(r * 0.299) + Math.floor(g * 0.587) + Math.floor(b * 0.114);
  };
  SpatialFiltering = function(grayImage, height, width, filter, size_f) {
    var from, i, init, j, k, m, n, resultImage, sum, to, _ref, _ref2, _ref3;
    init = Math.floor(size_f / 2);
    from = -init;
    to = init;
    resultImage = new Array(height * width);
    for (k = 0, _ref = height * width; (0 <= _ref ? k < _ref : k > _ref); (0 <= _ref ? k += 1 : k -= 1)) {
      resultImage[k] = 0;
    }
    for (i = init, _ref2 = height - init; (init <= _ref2 ? i < _ref2 : i > _ref2); (init <= _ref2 ? i += 1 : i -= 1)) {
      for (j = init, _ref3 = width - init; (init <= _ref3 ? j < _ref3 : j > _ref3); (init <= _ref3 ? j += 1 : j -= 1)) {
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
  canvas = $("#canvas").get(0);
  context = canvas.getContext('2d');
  canvas_to = $("#canvas_to").get(0);
  context_to = canvas_to.getContext('2d');
  img = new Image(width, height);
  img.src = "./images/lena.png";
  img.onload = function() {
    return context.drawImage(img, 0, 0);
  };
  $("#canvas").click(function() {
    var I, b, filter, g, grayImage, r, resultImage, x, y, _ref, _results;
    grayImage = new Array(width * height);
    for (y = 0; (0 <= height ? y < height : y > height); (0 <= height ? y += 1 : y -= 1)) {
      for (x = 0; (0 <= width ? x < width : x > width); (0 <= width ? x += 1 : x -= 1)) {
        _ref = getPixel(context, x, y), r = _ref[0], g = _ref[1], b = _ref[2];
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
          _results.push(setPixel(context_to, x, y, I, I, I, 255));
        }
        return _results;
      })());
    }
    return _results;
  });
})
