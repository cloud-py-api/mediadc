from __future__ import (absolute_import, division, print_function)

from PIL import Image
import numpy

__version__ = "4.2.1"

"""
You may copy this file, if you keep the copyright information below:


Copyright (c) 2013-2020, Johannes Buchner
https://github.com/JohannesBuchner/imagehash

All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
"""


def average_hash(image, hash_size=8, mean=numpy.mean):
    # reduce size and complexity, then covert to grayscale
    image = image.convert("L").resize((hash_size, hash_size), Image.ANTIALIAS)
    # find average pixel value; 'pixels' is an array of the pixel values, ranging from 0 (black) to 255 (white)
    pixels = numpy.asarray(image)
    avg = mean(pixels)
    diff = pixels > avg
    return diff


def phash(image, hash_size=8, highfreq_factor=4):
    import scipy.fftpack
    img_size = hash_size * highfreq_factor
    image = image.convert("L").resize((img_size, img_size), Image.ANTIALIAS)
    pixels = numpy.asarray(image)
    dct = scipy.fftpack.dct(scipy.fftpack.dct(pixels, axis=0), axis=1)
    dctlowfreq = dct[:hash_size, :hash_size]
    med = numpy.median(dctlowfreq)
    diff = dctlowfreq > med
    return diff


def phash_simple(image, hash_size=8, highfreq_factor=4):
    import scipy.fftpack
    img_size = hash_size * highfreq_factor
    image = image.convert("L").resize((img_size, img_size), Image.ANTIALIAS)
    pixels = numpy.asarray(image)
    dct = scipy.fftpack.dct(pixels)
    dctlowfreq = dct[:hash_size, 1:hash_size + 1]
    avg = dctlowfreq.mean()
    diff = dctlowfreq > avg
    return diff


def dhash(image, hash_size=8):
    image = image.convert("L").resize((hash_size + 1, hash_size), Image.ANTIALIAS)
    pixels = numpy.asarray(image)
    # compute differences between columns
    diff = pixels[:, 1:] > pixels[:, :-1]
    return diff


def dhash_vertical(image, hash_size=8):
    image = image.convert("L").resize((hash_size, hash_size + 1), Image.ANTIALIAS)
    pixels = numpy.asarray(image)
    # compute differences between rows
    diff = pixels[1:, :] > pixels[:-1, :]
    return diff


def whash(image, hash_size=8, image_scale=None, mode='haar', remove_max_haar_ll=True):
    import pywt
    if image_scale is not None:
        assert image_scale & (image_scale - 1) == 0, "image_scale is not power of 2"
    else:
        image_natural_scale = 2 ** int(numpy.log2(min(image.size)))
        image_scale = max(image_natural_scale, hash_size)

    ll_max_level = int(numpy.log2(image_scale))

    level = int(numpy.log2(hash_size))
    assert hash_size & (hash_size - 1) == 0, "hash_size is not power of 2"
    assert level <= ll_max_level, "hash_size in a wrong range"
    dwt_level = ll_max_level - level

    image = image.convert("L").resize((image_scale, image_scale), Image.ANTIALIAS)
    pixels = numpy.asarray(image) / 255.

    # Remove low level frequency LL(max_ll) if @remove_max_haar_ll using haar filter
    if remove_max_haar_ll:
        coeffs = pywt.wavedec2(pixels, 'haar', level=ll_max_level)
        coeffs = list(coeffs)
        coeffs[0] *= 0
        pixels = pywt.waverec2(coeffs, 'haar')

    # Use LL(K) as freq, where K is log2(@hash_size)
    coeffs = pywt.wavedec2(pixels, mode, level=dwt_level)
    dwt_low = coeffs[0]

    # Substract median and compute hash
    med = numpy.median(dwt_low)
    diff = dwt_low > med
    return diff


def colorhash(image, binbits=3):
    # bin in hsv space:
    intensity = numpy.asarray(image.convert("L")).flatten()
    h, s, v = [numpy.asarray(v).flatten() for v in image.convert("HSV").split()]
    # black bin
    mask_black = intensity < 256 // 8
    frac_black = mask_black.mean()
    # gray bin (low saturation, but not black)
    mask_gray = s < 256 // 3
    frac_gray = numpy.logical_and(~mask_black, mask_gray).mean()
    # two color bins (medium and high saturation, not in the two above)
    mask_colors = numpy.logical_and(~mask_black, ~mask_gray)
    mask_faint_colors = numpy.logical_and(mask_colors, s < 256 * 2 // 3)
    mask_bright_colors = numpy.logical_and(mask_colors, s > 256 * 2 // 3)

    c = max(1, mask_colors.sum())
    # in the color bins, make sub-bins by hue
    hue_bins = numpy.linspace(0, 255, 6 + 1)
    if mask_faint_colors.any():
        h_faint_counts, _ = numpy.histogram(h[mask_faint_colors], bins=hue_bins)
    else:
        h_faint_counts = numpy.zeros(len(hue_bins) - 1)
    if mask_bright_colors.any():
        h_bright_counts, _ = numpy.histogram(h[mask_bright_colors], bins=hue_bins)
    else:
        h_bright_counts = numpy.zeros(len(hue_bins) - 1)

    # now we have fractions in each category (6*2 + 2 = 14 bins)
    # convert to hash and discretize:
    maxvalue = 2 ** binbits
    values = [min(maxvalue - 1, int(frac_black * maxvalue)), min(maxvalue - 1, int(frac_gray * maxvalue))]
    for counts in list(h_faint_counts) + list(h_bright_counts):
        values.append(min(maxvalue - 1, int(counts * maxvalue * 1. / c)))
    # print(values)
    bitarray = []
    for v in values:
        bitarray += [v // (2 ** (binbits - i - 1)) % 2 ** (binbits - i) > 0 for i in range(binbits)]
    return numpy.asarray(bitarray).reshape((-1, binbits))
