import cv2
import os

def extract_sprites_cv2(spritesheet_path, num_cols, num_rows, margin=0, output_dir="sprites"):
  try:
    img = cv2.imread(spritesheet_path, cv2.IMREAD_UNCHANGED)

    if img is None:
      raise FileNotFoundError(f"Image not found at {spritesheet_path}")

    height, width, channels = img.shape

    # Calculate sprite dimensions based on image size and number of sprites
    sprite_width = (width - margin * (num_cols + 1)) // num_cols
    sprite_height = (height - margin * (num_rows + 1)) // num_rows

    # Create the output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    for row in range(num_rows):
      for col in range(num_cols):
        left = col * (sprite_width + margin) + margin
        top = row * (sprite_height + margin) + margin
        right = left + sprite_width
        bottom = top + sprite_height

        sprite = img[top:bottom, left:right]

        # Save, handling transparency
        filename = os.path.join(output_dir, f"sprite_{row}_{col}.png")
        cv2.imwrite(filename, sprite)

  except FileNotFoundError as e:
    print(f"Error: {e}")
  except Exception as e:
    print(f"An error occurred: {e}")

extract_sprites_cv2("client/src/assets/spritesheet.png", 6, 7, 0, "client/src/assets/extracted_sprites")  
