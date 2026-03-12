import scribus

def create_image_with_2mm_margin():
    # --- Configuration ---
    image_w = 100.0   # 10 cm Image
    image_h = 100.0   # 10 cm Image
    margin  = 2.0     # 2 mm margin
    
    # 100mm + 2mm left + 2mm right = 104mm total width
    outer_w = image_w + (margin * 2) 
    outer_h = image_h + (margin * 2)
    
    # Crop Mark Settings
    mark_length = 5.0 
    offset = 2.0      
    
    if not scribus.haveDoc():
        scribus.messageBox("Error", "Please have an A4 document open first.", scribus.ICON_WARNING)
        return

    scribus.setUnit(scribus.UNIT_MILLIMETERS)
    
    # SYSTEM SAFETY: wrapping in try/finally to prevent "freeze" crashes
    try:
        scribus.setRedraw(False)

        # --- Calculations ---
        page_w, page_h = scribus.getPageSize()
        
        # Center coordinates
        outer_x = (page_w - outer_w) / 2
        outer_y = (page_h - outer_h) / 2
        
        inner_x = (page_w - image_w) / 2
        inner_y = (page_h - image_h) / 2

        # --- Drawing ---
        
        # 1. Create Image Frame
        img_frame = scribus.createImage(inner_x, inner_y, image_w, image_h)
        # Set to no border/stroke
        scribus.setLineWidth(0, img_frame)
        scribus.setLineColor("None", img_frame)
        
        # 2. Draw Crop Marks
        # Helper function to draw a line and style it immediately
        def draw_mark(x1, y1, x2, y2):
            l = scribus.createLine(x1, y1, x2, y2)
            scribus.setLineWidth(0.1, l) # Hairline
            scribus.setLineColor("Black", l)

        # Top-Left
        draw_mark(outer_x - offset - mark_length, outer_y, outer_x - offset, outer_y)
        draw_mark(outer_x, outer_y - offset - mark_length, outer_x, outer_y - offset)
        
        # Top-Right
        draw_mark(outer_x + outer_w + offset, outer_y, outer_x + outer_w + offset + mark_length, outer_y)
        draw_mark(outer_x + outer_w, outer_y - offset - mark_length, outer_x + outer_w, outer_y - offset)

        # Bottom-Right
        draw_mark(outer_x + outer_w + offset, outer_y + outer_h, outer_x + outer_w + offset + mark_length, outer_y + outer_h)
        draw_mark(outer_x + outer_w, outer_y + outer_h + offset, outer_x + outer_w, outer_y + outer_h + offset + mark_length)

        # Bottom-Left
        draw_mark(outer_x - offset - mark_length, outer_y + outer_h, outer_x - offset, outer_y + outer_h)
        draw_mark(outer_x, outer_y + outer_h + offset, outer_x, outer_y + outer_h + offset + mark_length)

    except Exception as e:
        # If something breaks, tell us what it is
        scribus.messageBox("Script Error", str(e), scribus.ICON_WARNING)
        
    finally:
        # ALWAYS turn screen updates back on, or Scribus will look frozen
        scribus.setRedraw(True)
        scribus.redrawAll()

create_image_with_2mm_margin()