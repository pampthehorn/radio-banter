import scribus

def draw_center_fold_lines():
    if not scribus.haveDoc():
        scribus.messageBox("Error", "Please have your document open first.", scribus.ICON_WARNING)
        return

    scribus.setRedraw(False)
    scribus.setUnit(scribus.UNIT_POINTS)

    # --- Dimensions ---
    # A4 Landscape
    page_w = 841.89
    page_h = 595.28
    
    # Calculate Center X
    center_x = page_w / 2.0
    
    # --- Calculate Safe Zones ---
    # We use the same math as before to find where your content starts/ends
    # so we don't draw over it.
    old_y1 = 8.50394
    old_y2 = 347.666
    content_h = old_y2 - old_y1 # ~339 pt
    
    # New Center Y of page
    new_cy = page_h / 2.0
    
    # Calculate the Y top and bottom of your image content
    content_top = new_cy - (content_h / 2.0)
    content_bottom = new_cy + (content_h / 2.0)
    
    # Gap (Buffer) so the line doesn't touch the image
    gap = 10.0

    try:
        page_count = scribus.pageCount()
        
        for i in range(1, page_count + 1):
            scribus.gotoPage(i)
            
            # 1. Top Fold Line (From edge of page down to near the image)
            # Starts at Y=0, Ends at content_top - gap
            l1 = scribus.createLine(center_x, 0, center_x, content_top - gap)
            
            # Style: Dashed line, thin gray (so it's subtle)
            scribus.setLineWidth(0.5, l1)
            scribus.setLineColor("Black", l1)
            # Set Line Style to Dashed (Constant 3 or 2 usually, varies by version)
            # If this doesn't dash, it will just be a solid thin line which is also fine.
            try:
                scribus.setLineStyle(scribus.LINE_DASH, l1) 
            except:
                pass 

            # 2. Bottom Fold Line (From near image down to bottom of page)
            # Starts at content_bottom + gap, Ends at page_h
            l2 = scribus.createLine(center_x, content_bottom + gap, center_x, page_h)
            
            scribus.setLineWidth(0.5, l2)
            scribus.setLineColor("Black", l2)
            try:
                scribus.setLineStyle(scribus.LINE_DASH, l2)
            except:
                pass

    except Exception as e:
        scribus.messageBox("Error", str(e), scribus.ICON_WARNING)

    finally:
        scribus.setRedraw(True)
        scribus.redrawAll()
        scribus.messageBox("Done", "Fold lines added to top and bottom margins.", scribus.ICON_INFORMATION)

draw_center_fold_lines()