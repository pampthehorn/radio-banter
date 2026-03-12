import scribus

def create_two_images_with_cuts():
    # --- Configuration ---
    # Image Dimensions (mm)
    img_w = 140.0   # 14 cm
    img_h = 125.0   # 12.5 cm
    
    # Gap between the two images (to allow space for cut lines)
    gap = 15.0 
    
    # Crop Mark Settings
    mark_len = 5.0  # Length of the black cut line
    offset = 3.0    # Distance from the image edge
    
    # --- Setup New Document ---
    # If no document is open, create a new A4 Portrait one.
    if not scribus.haveDoc():
        # PAPER_A4, Margins(10,10,10,10), PORTRAIT, 1 Layout, UNIT_MILLIMETERS
        scribus.newDocument(scribus.PAPER_A4, (10,10,10,10), scribus.PORTRAIT, 1, scribus.UNIT_MILLIMETERS, scribus.PAGE_1, 0, 1)
    
    scribus.setUnit(scribus.UNIT_MILLIMETERS)
    
    # --- Calculations ---
    page_w, page_h = scribus.getPageSize()
    
    # 1. Horizontal Center (Same for both)
    # (210 - 140) / 2 = 35mm
    x_pos = (page_w - img_w) / 2.0
    
    # 2. Vertical Positioning (Stacked)
    # Total height required = 2 images + gap
    total_content_h = (img_h * 2) + gap
    
    # Starting Y position (Top Margin) to center the whole block vertically
    start_y = (page_h - total_content_h) / 2.0
    
    # Coordinates for the two images
    # Image 1 (Top)
    img1_y = start_y
    # Image 2 (Bottom)
    img2_y = start_y + img_h + gap

    # --- Drawing Function ---
    def create_frame_and_marks(x, y, w, h, label):
        # 1. Create Image Frame
        frame = scribus.createImage(x, y, w, h)
        # Remove border
        scribus.setLineWidth(0, frame)
        scribus.setLineColor("None", frame)
        
        # 2. Draw Crop Marks
        # Helper for ticks
        def draw_tick(lx1, ly1, lx2, ly2):
            l = scribus.createLine(lx1, ly1, lx2, ly2)
            scribus.setLineWidth(0.1, l) # Hairline
            scribus.setLineColor("Black", l)

        # Top-Left Corner
        draw_tick(x - offset - mark_len, y, x - offset, y) # Horiz
        draw_tick(x, y - offset - mark_len, x, y - offset) # Vert
        
        # Top-Right Corner
        draw_tick(x + w + offset, y, x + w + offset + mark_len, y) # Horiz
        draw_tick(x + w, y - offset - mark_len, x + w, y - offset) # Vert

        # Bottom-Right Corner
        draw_tick(x + w + offset, y + h, x + w + offset + mark_len, y + h) # Horiz
        draw_tick(x + w, y + h + offset, x + w, y + h + offset + mark_len) # Vert

        # Bottom-Left Corner
        draw_tick(x - offset - mark_len, y + h, x - offset, y + h) # Horiz
        draw_tick(x, y + h + offset, x, y + h + offset + mark_len) # Vert

    # --- Execution ---
    try:
        scribus.setRedraw(False)
        
        # Draw First Image
        create_frame_and_marks(x_pos, img1_y, img_w, img_h, "Top Image")
        
        # Draw Second Image
        create_frame_and_marks(x_pos, img2_y, img_w, img_h, "Bottom Image")

    except Exception as e:
        scribus.messageBox("Error", str(e), scribus.ICON_WARNING)
        
    finally:
        scribus.setRedraw(True)
        scribus.redrawAll()
        scribus.messageBox("Done", "Created 2 images (14x12.5cm) with cut lines.", scribus.ICON_INFORMATION)

create_two_images_with_cuts()