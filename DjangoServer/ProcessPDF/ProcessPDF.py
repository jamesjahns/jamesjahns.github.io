from pdf2image import convert_from_bytes
import PIL.Image
import cv2
import numpy as np
import base64
import json

TEMPLATES = ["solid_on_line.png","solid_on_space.png","open_on_line.png","open_on_space.png","whole_on_line.png","whole_on_space.png"]

def process(file):
    images = convert_from_bytes(file)
    pic_num = 0

    json_dict = {}

    # each img is a different page of the pdf
    for img in images:
        image = np.array(img.convert('L'))

        #kernel checking for vertical lines
        vert_kernel = np.zeros((11,11),np.uint8)
        for i in range(11):
            vert_kernel[i][5] = 1;

        #make image binary (all pixels are either black or white)
        eroded = cv2.threshold(image, 127, 255, cv2.THRESH_BINARY)[1]

        #erode image using above kernel, removing all non-long, non-horizontal lines
        #the result is that only measure lines remain, allowing us to
        #find the staves in the image and then break the image up accordingly
        eroded = cv2.erode(255-eroded,vert_kernel,iterations=5);

        #break up the image based on staves as found in the eroded image
        cropped_images = split_by_staves(image,eroded)

        #generate json dict containing images and their respective notes
        for i in range(len(cropped_images)):
            json_dict[pic_num] = {}

            # find notes
            notes = find_notes(cropped_images[i]);
            json_dict[pic_num]['notes'] = notes

            # convert image to base64
            retval, buffer = cv2.imencode('.png', cropped_images[i])
            # we decode the encoding since JSON cannot accept raw bytes
            json_dict[pic_num]['image'] = base64.b64encode(buffer).decode('utf-8')

            pic_num += 1

    # return dictionary converted to JSON
    return json.dumps(json_dict)

# First finds the horizontal lines in eroded, which correspond to staves in the image
# Then split the image in such a way that each split contains a single stave
# Returns an array of the cropped images (in np.array form)
def split_by_staves(image,eroded):
    MIN_STAVE_LEN = 100
    MIN_SUM = 255 # a single white pixel

    # contains tuples corresponding to the vertical positions of each horiz line
    horiz_lines = []

    line_start = 0

    for i in range(1,len(eroded)):
        row = eroded[i]
        result = sum(row)

        if result > MIN_SUM:
            # occurs on line begin
            if line_start == 0:
                line_start = i
        # occurs on line end
        elif line_start != 0:
            if (i - line_start) >= MIN_STAVE_LEN:
                horiz_lines.append((line_start,i))
            line_start = 0

    # if still in stave by end of loop, close it off
    if line_start != 0:
        horiz_lines.append((line_start,len(eroded) - 1))

    # split the image halfway between each horizontal line
    cropped_images = []
    prev_crop_point = 0
    for i in range(len(horiz_lines)-1):
        next_crop_point = int(horiz_lines[i][1] + 0.5 * (horiz_lines[i+1][0] - horiz_lines[i][1]) )
        cropped_images.append(image[prev_crop_point:next_crop_point])
        prev_crop_point = next_crop_point
    # add the last image, which reaches to the end of image
    cropped_images.append(image[prev_crop_point:])

    return cropped_images

def find_notes(image):
    locations = []
    for template in TEMPLATES:
        new_locs = find_template(image,"ProcessPDF/templates/"+template)
        locations.extend(new_locs)

    locations = remove_closeby(locations);

    return locations


def find_template(image,file):
    #TODO: care about scale/size of images!
    THRESHOLD = 0.7
    tpl = cv2.imread(file,0)
    hwid = tpl.shape[0] / 2;

    result = cv2.matchTemplate(image, tpl, cv2.TM_CCOEFF_NORMED)

    found = np.where(result >= THRESHOLD)

    locations = found[1] + hwid
    return locations

# removes elements in array that are too close in value to other elements of the array
CLOSEBY_THRESHOLD = 10
def remove_closeby(locations):
    if len(locations) == 0:
        return;
    locations.sort()

    new_list = [locations[0]]
    last_appended = locations[0]
    # only append points that are >threshold away from the last-appended point
    for i in range(1,len(locations)):
        if locations[i] - last_appended > CLOSEBY_THRESHOLD:
            new_list.append(locations[i])
            last_appended = locations[i]

    return new_list;
