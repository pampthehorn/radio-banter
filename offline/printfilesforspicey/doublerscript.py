import scribus

def layout_two_up_horizontal():
    """
    Groups all items, centers them vertically,
    and arranges two copies side-by-side (horizontally)
    with even spacing.
    """
    if not scribus.haveDoc():
        scribus.messageBox('Error', 'No document open.', scribus.ICON_WARNING)
        return

    scribus.setRedraw(False)

    try:
        # 1. Get Page Dimensions (Landscape)
        page_w, page_h = scribus.getPageSize()

        # 2. Identify objects
        obj_names = scribus.getAllObjects()
        
        if not obj_names:
            scribus.messageBox('Error', 'No objects found.', scribus.ICON_WARNING)
            return

        # 3. Handle Grouping
        # If there is more than 1 object, we group them.
        # If there is only 1 object (you already grouped them), we just use it.
        if len(obj_names) > 1:
            scribus.deselectAll()
            for name in obj_names:
                scribus.selectObject(name)
            main_group = scribus.groupObjects(obj_names)
        else:
            main_group = obj_names[0]

        # 4. Get Group Dimensions
        g_w = scribus.getProperty(main_group, 'width')
        g_h = scribus.getProperty(main_group, 'height')

        # 5. Calculate Horizontal (X) Layout
        # We need 2 items side-by-side. Total width = width * 2
        total_content_w = g_w * 2
        remaining_space_x = page_w - total_content_w
        
        if remaining_space_x < 0:
            scribus.messageBox('Warning', 'Objects are too wide to fit side-by-side.', scribus.ICON_WARNING)
            scribus.setRedraw(True)
            return

        # Split remaining width into 3 equal gaps (Left, Center, Right)
        gap = remaining_space_x / 3.0
        
        x_pos_left = gap
        x_pos_right = gap + g_w + gap

        # 6. Calculate Vertical (Y) Center
        # (Page Height - Group Height) / 2
        y_pos_center = (page_h - g_h) / 2.0

        # 7. Move Original Group to Left Position
        # This fixes the "off-centre" issue by forcing it to the calculated coordinates
        scribus.moveObjectAbs(x_pos_left, y_pos_center, main_group)

        # 8. Duplicate and Move to Right Position
        duplicate_group = scribus.duplicateObject(main_group)
        scribus.moveObjectAbs(x_pos_right, y_pos_center, duplicate_group)

    except Exception as e:
        scribus.messageBox('Error', 'An error occurred: ' + str(e), scribus.ICON_WARNING)

    finally:
        scribus.deselectAll()
        scribus.setRedraw(True)
        scribus.docChanged(True)

# Run the script
layout_two_up_horizontal()