getPixel = (ctx, x, y) ->
  pixelData = ctx.getImageData(x, y, 1, 1).data
  [pixelData[0], pixelData[1], pixelData[2]]


toGrayscale = (r, g, b) ->
  Math.floor(r * 0.299) + Math.floor(g * 0.587) + Math.floor(b * 0.114)


SpatialFiltering = (grayImage, height, width, filter, size_f) ->
  init = Math.floor(size_f / 2)
  from = -init
  to = init
  resultImage = new Array(height * width)

  for k in [0...(height*width)]
    resultImage[k] = 0

  for i in [init...(height - init)]
    for j in [init...(width - init)]
      sum = 0.0
      for n in [from..to]
        for m in [from..to]
          sum += grayImage[(i + n) * width + j + m] * filter[(n + init) * size_f + m + init]

      resultImage[i * width + j] = Math.floor Math.abs sum

  return resultImage


setPixel = (ctx, x, y, r, g, b, a) ->
  pixelImage = ctx.createImageData(1, 1)
  pixelImage.data[0..3] = [r, g, b, a]
  ctx.putImageData(pixelImage, x, y)




width = 256
height = 256
canvas = $("#canvas").get(0)
context = canvas.getContext('2d')
canvas_to = $("#canvas_to").get(0)
context_to = canvas_to.getContext('2d')
img = new Image(width, height)
img.src = "./images/lena.png"
img.onload = ->
  context.drawImage(img, 0, 0)

$("#canvas").click ->
  grayImage = new Array(width * height)

  for y in [0...height]
    for x in [0...width]
      [r, g, b] = getPixel(context, x, y)
      grayImage[y * width + x] = toGrayscale(r, g, b)

  filter = [
    1, 0, -1
    1, 0, -1
    1, 0, -1
  ]

  resultImage = SpatialFiltering(grayImage, height, width, filter, 3)

  for y in [0...height]
    for x in [0...width]
      I = resultImage[y * width + x]
      setPixel(context_to, x, y, I, I, I, 255)
