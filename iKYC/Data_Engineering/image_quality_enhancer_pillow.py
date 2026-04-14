from PIL import Image, ImageEnhance

# Open the image
image = Image.open('assets/Aadhar.webp')

# Enhance sharpness
enhancer_sharpness = ImageEnhance.Sharpness(image)
sharpened_image = enhancer_sharpness.enhance(2.0) # Factor > 1 for more sharpness

# Enhance contrast
enhancer_contrast = ImageEnhance.Contrast(sharpened_image)
contrasted_image = enhancer_contrast.enhance(1.5)

# Save the enhanced image
contrasted_image.save('output_enhanced.jpg')