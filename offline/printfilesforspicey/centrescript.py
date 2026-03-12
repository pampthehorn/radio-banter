import scribus

def force_center_all_content():
    if not scribus.haveDoc():
        scribus.messageBox("Error", "Please have your document open first.", scribus.ICON_WARNING)
        return

    scribus.setRedraw(False)
    scribus.setUnit(scribus.UNIT_POINTS)

    # --- CONSTANTS ---
    # Target: A4 Landscape
    new_w = 841.89
    new_h = 595.28
    
    # Original Content Area (from your file coordinates)
    old_x1 = 8.50394
    old_y1 = 8.50394
    old_x2 = 691.832
    old_y2 = 347.666
    
    # --- CALCULATE SHIFT ---
    # 1. Find center of old content
    old_cx = old_x1 + ((old_x2 - old_x1) / 2.0)
    old_cy = old_y1 + ((old_y2 - old_y1) / 2.0) # Approx 178.0 pts
    
    # 2. Find center of new A4 page
    new_cx = new_w / 2.0
    new_cy = new_h / 2.0 # Approx 297.6 pts

    # 3. Calculate the difference
    shift_x = new_cx - old_cx # Approx +70 pts
    shift_y = new_cy - old_cy # Approx +120 pts
    
    # --- THE THRESHOLD ---
    # We need to distinguish between "Old Content" (needs moving) and "Cut Lines" (already correct).
    # Old content is centered at Y=178. New Cut Lines are centered at Y=297.
    # The midpoint is approx Y=238.
    # RULE: If an object's center Y is < 238, it is "Old Content". Move it.
    y_threshold = 238.0

    moved_count = 0
    skipped_count = 0

    try:
        # Get list of ALL objects in the file
        all_objs = scribus.getAllObjects()
        
        for obj_name in all_objs:
            try:
                # 1. Grab the object
                scribus.selectObject(obj_name)
                
                # 2. Get its geometric center
                x, y = scribus.getPosition(obj_name)
                w, h = scribus.getSize(obj_name)
                obj_cy = y + (h / 2.0)
                
                # 3. THE SMART CHECK
                # If the object is sitting "High" (Old Position), move it down/right.
                if obj_cy < y_threshold:
                    scribus.moveObject(shift_x, shift_y, obj_name)
                    moved_count += 1
                else:
                    # Object is already "Low" (New Position or Cut Line), ignore it.
                    skipped_count += 1
                
                scribus.deselectAll()
                
            except Exception as inner_e:
                # If an object is locked/invalid, just skip it
                pass

    except Exception as e:
        scribus.messageBox("Error", str(e), scribus.ICON_WARNING)

    finally:
        scribus.setRedraw(True)
        scribus.redrawAll()
        scribus.messageBox("Result", 
                           f"Process Complete.\n\n" +
                           f"Moved: {moved_count} items (Old Content)\n" +
                           f"Skipped: {skipped_count} items (Cut Lines/Already Centered)", 
                           scribus.ICON_INFORMATION)

force_center_all_content()