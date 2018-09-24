# jamesjahns.github.io (also hosted at [harmonynotes.tk](harmonynotes.tk))

## GitHub Pages Website for harmonynotes.tk, a simple web app that allows users to upload PDFs of sheet music and highlight them for harmonic analysis.

To try it for yourself, if you don't have a PDF handy, there is a "sample PDF" option after you click "upload PDF".

This project was done for learning/experience and as such it will be a little rough around the edges.

Features:
- Python backend (using Django, running on AWS EC2 instance) that uses OpenCV to process the PDF
  - Converts PDF to image
  - Splits image based on musical staves
  - Locates the notes in the image via template matching and sends the image/note locations to the frontend
- Javascript frontend
  - Allows user to highlight notes on the image, then label with a chord name
  - Colors based on chord type and scale degree of chord
  - Colors based on current key and will change accordingly if the user changes the scale
  - Bootstrap-based design, allowing for PDF preview, modal windows, etc.
  
