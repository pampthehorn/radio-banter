import scribus

def relayout_final():
    if not scribus.haveDoc():
        scribus.messageBox("Error", "Please have your document open first.", scribus.ICON_WARNING)
        return

    scribus.setRedraw(False)
    scribus.setUnit(scribus.UNIT_POINTS)

    # --- Configuration ---
    # Target: A4 Landscape (in Points)
    new_w = 841.89
    new_h = 595.28

    # Original "Cut Box" coordinates (from your file)
    old_x1 = 8.50394
    old_y1 = 8.50394
    old_x2 = 691.832
    old_y2 = 347.666

    # --- Calculations ---
    cut_w = old_x2 - old_x1
    cut_h = old_y2 - old_y1
    
    # Calculate Center Offsets
    cut_cx = old_x1 + (cut_w / 2.0)
    cut_cy = old_y1 + (cut_h / 2.0)
    
    new_cx = new_w / 2.0
    new_cy = new_h / 2.0

    move_x = new_cx - cut_cx
    move_y = new_cy - cut_cy

    # New cut line positions relative to the new A4 page
    nx1 = old_x1 + move_x
    nx2 = old_x2 + move_x
    ny1 = old_y1 + move_y
    ny2 = old_y2 + move_y

    resize_success = False

    try:
        # STEP 1: MOVE CONTENT
        # Get list of ALL objects before we create any new lines
        all_objs = scribus.getAllObjects()
        
        for obj_name in all_objs:
            try:
                # Critical Fix: Explicitly select the object.
                # This forces Scribus to focus the page containing the object.
                scribus.selectObject(obj_name)
                scribus.moveObject(move_x, move_y, obj_name)
                scribus.deselectAll()
            except:
                # If an object is locked or weird, skip it
                pass

        # STEP 2: RESIZE PAGES
        page_count = scribus.pageCount()
        for i in range(1, page_count + 1):
            scribus.gotoPage(i)
            # Try to resize
            if hasattr(scribus, 'setPageSize'):
                scribus.setPageSize(new_w, new_h)
                resize_success = True
            elif hasattr(scribus, 'sizePage'):
                scribus.sizePage(new_w, new_h)
                resize_success = True

        # STEP 3: DRAW CUT LINES
        # We do this LAST so we don't accidentally move the cut lines
        def draw_tick(x1, y1, x2, y2):
            l = scribus.createLine(x1, y1, x2, y2)
            scribus.setLineWidth(0.5, l)
            scribus.setLineColor("Black", l)

        for i in range(1, page_count + 1):
            scribus.gotoPage(i)
            
            tick = 20
            # Top Left
            draw_tick(nx1 - tick, ny1, nx1, ny1)
            draw_tick(nx1, ny1 - tick, nx1, ny1)
            # Top Right
            draw_tick(nx2, ny1, nx2 + tick, ny1)
            draw_tick(nx2, ny1 - tick, nx2, ny1)
            # Bottom Left
            draw_tick(nx1 - tick, ny2, nx1, ny2)
            draw_tick(nx1, ny2, nx1, ny2 + tick)
            # Bottom Right
            draw_tick(nx2, ny2, nx2 + tick, ny2)
            draw_tick(nx2, ny2, nx2, ny2 + tick)

    except Exception as e:
        scribus.messageBox("Script Error", str(e), scribus.ICON_WARNING)

    finally:
        scribus.setRedraw(True)
        scribus.redrawAll()
        
        if not resize_success:
            scribus.messageBox("Done", "Content moved and lines drawn.\n(Manual Page Resize Required)", scribus.ICON_INFORMATION)
        else:
            scribus.messageBox("Success", "Document re-layout complete.", scribus.ICON_INFORMATION)

relayout_final()