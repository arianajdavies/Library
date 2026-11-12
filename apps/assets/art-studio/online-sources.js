const IMAGE_SOURCES = [
  {
    "id": "bath",
    "url": "https://www.artic.edu/iiif/2/3b885ae0-4d46-5fe4-d70a-00474827f02c/full/1200,/0/default.jpg",
    "page": "https://www.artic.edu/artworks/111442/the-child-s-bath",
    "credit": "Art Institute of Chicago, public-domain image"
  },
  {
    "id": "banjo",
    "url": "https://upload.wikimedia.org/wikipedia/commons/2/25/Henry_Ossawa_Tanner_-_The_Banjo_Lesson.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Henry_Ossawa_Tanner_-_The_Banjo_Lesson.jpg",
    "credit": "Hampton University Museum; public-domain reproduction via Wikimedia Commons"
  },
  {
    "id": "gourmet",
    "url": "https://api.nga.gov/iiif/e19a2b28-639c-4d6a-848c-da253d5ee6b9/full/!1200,1200/0/default.jpg",
    "page": "https://www.nga.gov/artworks/46527-le-gourmet",
    "credit": "National Gallery of Art, Chester Dale Collection; © Estate of Pablo Picasso / Artists Rights Society (ARS), New York"
  },
  {
    "id": "games",
    "url": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Pieter_Bruegel_the_Elder_-_Children%E2%80%99s_Games_-_Google_Art_Project.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Pieter_Bruegel_the_Elder_-_Children%E2%80%99s_Games_-_Google_Art_Project.jpg",
    "credit": "Kunsthistorisches Museum; Google Art Project / Wikimedia Commons, public-domain reproduction"
  },
  {
    "id": "whip",
    "url": "https://images.metmuseum.org/CRDImages/ad/original/DP-20820-001.jpg",
    "page": "https://www.metmuseum.org/art/collection/search/11140",
    "credit": "The Metropolitan Museum of Art, 50.41; public-domain image. This is the Met version with the open sky, matching the book."
  },
  {
    "id": "mobile",
    "url": "https://www.moma.org/media/W1siZiIsIjQ3NDY3MiJdLFsicCIsImNvbnZlcnQiLCItcXVhbGl0eSA5MCAtcmVzaXplIDIwMDB4MjAwMFx1MDAzZSJdXQ.jpg?sha=a9164197a8eb5dce",
    "page": "https://www.moma.org/collection/works/81621",
    "credit": "The Museum of Modern Art; © Calder Foundation, New York / Artists Rights Society (ARS), New York"
  },
  {
    "id": "liberty",
    "url": "https://upload.wikimedia.org/wikipedia/commons/8/89/Front_view_of_Statue_of_Liberty_%28cropped%29.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Front_view_of_Statue_of_Liberty_(cropped).jpg",
    "credit": "Photo: AskALotl, 2024, CC0, via Wikimedia Commons; resized for this app."
  },
  {
    "id": "lincoln",
    "url": "https://upload.wikimedia.org/wikipedia/commons/8/80/Lincoln_statue%2C_Lincoln_Memorial.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Lincoln_statue,_Lincoln_Memorial.jpg",
    "credit": "Photo: Raul654, 2002, CC BY-SA 3.0, via Wikimedia Commons. Resized JPEG; this image remains available under the same license."
  },
  {
    "id": "robe",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Matisse_-_Purple_Robe_and_Anemones_%281937%29.jpg/960px-Matisse_-_Purple_Robe_and_Anemones_%281937%29.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Matisse_-_Purple_Robe_and_Anemones_(1937).jpg",
    "credit": "Baltimore Museum of Art, Cone Collection, 1950.261; reproduction via Wikimedia Commons; © Succession H. Matisse / Artists Rights Society"
  },
  {
    "id": "samisen",
    "url": "https://ids.si.edu/ids/deliveryService?id=FS-8233_01&max=1600",
    "page": "https://asia-archive.si.edu/object/F1904.241/",
    "credit": "Smithsonian National Museum of Asian Art, Freer Collection F1904.241, CC0"
  },
  {
    "id": "miro",
    "url": "https://www.joan-miro.net/assets/img/paintings/figures-and-dog-in-front-of-the-sun.jpg",
    "page": "https://www.joan-miro.net/figures-and-dog-in-front-of-the-sun.jsp",
    "credit": "Reproduction via Joan-Miro.net; © Successió Miró / Artists Rights Society"
  },
  {
    "id": "blue",
    "url": "https://www.singulart.com/blog/wp-content/uploads/2024/02/Blue-Atmosphere.jpg",
    "page": "https://www.singulart.com/blog/en/2024/02/14/blue-atmosphere-by-helen-frankenthaler/",
    "credit": "Reproduction via Singulart; © Helen Frankenthaler Foundation / Artists Rights Society. Matching online image limited to 300 × 494 pixels."
  },
  {
    "id": "tahiti",
    "url": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Paul_Gauguin_-_Tahitian_Landscape_-_Google_Art_Project.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Paul_Gauguin_-_Tahitian_Landscape_-_Google_Art_Project.jpg",
    "credit": "Minneapolis Institute of Art, 49.10; Google Art Project / Wikimedia Commons, public-domain reproduction"
  },
  {
    "id": "snow",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d8/Pieter_Bruegel_the_Elder_-_Hunters_in_the_Snow_%28Winter%29_-_Google_Art_Project.jpg/1280px-Pieter_Bruegel_the_Elder_-_Hunters_in_the_Snow_%28Winter%29_-_Google_Art_Project.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Pieter_Bruegel_the_Elder_-_Hunters_in_the_Snow_(Winter)_-_Google_Art_Project.jpg",
    "credit": "Kunsthistorisches Museum; Google Art Project / Wikimedia Commons, public-domain reproduction"
  },
  {
    "id": "hippo",
    "url": "https://images.metmuseum.org/CRDImages/eg/original/DP248992.jpg",
    "page": "https://www.metmuseum.org/art/collection/search/544227",
    "credit": "The Metropolitan Museum of Art, 17.9.1, Gift of Edward S. Harkness, 1917; public-domain image."
  }
]
;
