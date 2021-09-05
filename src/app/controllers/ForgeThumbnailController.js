/* eslint-disable prefer-spread */
/* eslint-disable no-console */
import sizeOf from 'image-size';

import sharp from 'sharp';

Array.min = async array => {
  return Math.min.apply(Math, array);
};

class ForgeThumbnailController {
  async store(req, res) {
    const uri = req.body.image.split(',').pop(); // remove os valores da string base64

    try {
      const imgBuffer = Buffer.from(uri, 'base64'); // converte pra base64

      const dimensions = sizeOf(imgBuffer); // usa o modulo sharp pra reduzir image

      const crop = await Array.min([dimensions.width, dimensions.height]);

      await sharp(imgBuffer)
        .resize(crop || 200, crop || 200)
        .toBuffer()
        .then(async data => {
          const encode = await Buffer.from(data).toString('base64');

          return res.json({
            thumbnail: `data:image/jpeg;base64,${encode}`,
            original: req.body.image,
          });
        })
        .catch(err => console.log(`Error - ${err}`));
    } catch (err) {
      return res.json(err);
    }

    return res.json([]);
  }
}

export default new ForgeThumbnailController();
