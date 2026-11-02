// Photos on the Camera Roll tab, as many to a row as fit, newest first by `date`; photos
// with the same date keep the order they're listed in here. Each shows as a
// square crop in the grid and opens at its original shape when clicked.

export type GalleryPhoto = {
  // Filename of an image in src/assets/gallery, e.g. 'istanbul.jpg' (upper or
  // lower case both match). Any size or shape works; upload the original and
  // smaller versions are made at build.
  image: string;
  // Describes the photo for screen readers, e.g. 'Ferry crossing the Bosphorus at dusk'.
  alt: string;
  // Shown only in the lightbox, over the bottom of the photo, e.g. 'Kadıköy, 2025'.
  // Leave out for no title.
  title?: string;
  // Groups photos under the filter buttons above the grid, e.g. 'Istanbul'. Each
  // distinct tag gets a button, in the order it first appears here, after 'All'.
  // Spell a tag the same way every time, or it becomes a separate button.
  tag: string;
  // When the photo was taken, as day, month name and year: '2 September 2026'.
  // Sets the order.
  date: string;
};

export const gallery: GalleryPhoto[] = [
  { image: 'lili-1.jpg', alt: 'Lili, a tiny tabby kitten, lying belly-up in a fluffy red blanket with paws raised', tag: 'Lili', date: '30 October 2026' },
  { image: 'lili-2.jpg', alt: 'Lili peeking out from the folds of a fluffy red blanket, only the head showing', tag: 'Lili', date: '30 October 2026' },
  { image: 'lili-3.jpg', alt: 'Lili lying belly-up in a nest of red blanket, looking drowsily at the camera', tag: 'Lili', date: '30 October 2026' },
  { image: 'lili-4.jpg', alt: 'Close-up of Lili’s face tucked under a red blanket, a striped paw blurred in front', tag: 'Lili', date: '30 October 2026' },
  { image: 'lili-5.jpg', alt: 'Lili peering out through the grille of a pet carrier, an orange-and-white cat blurred in the foreground', tag: 'Lili', date: '24 October 2026' },
  { image: 'lili-6.jpg', alt: 'Lili meowing through the grille of a pet carrier door', tag: 'Lili', date: '24 October 2026' },
  { image: 'lili-7.jpg', alt: 'Lili pressing against the bars of a pet carrier door, mouth open mid-meow', tag: 'Lili', date: '24 October 2026' },
  { image: 'lili-8.jpg', alt: 'Lili squinting contentedly while rubbing a cheek against a pet carrier door', tag: 'Lili', date: '24 October 2026' },
  { image: 'lili-9.jpg', alt: 'Lili staring wide-eyed through the grille of a pet carrier door', tag: 'Lili', date: '24 October 2026' },
  { image: 'nova-1.jpg', alt: 'Nova, a calico cat, curled up asleep on a dark wooden floor in a beam of sunlight', tag: 'Nova', date: '2 September 2026' },
  { image: 'nova-2.jpg', alt: 'Nova, a green-eyed calico cat, resting a chin on the edge of a cardboard box', tag: 'Nova', date: '13 July 2026' },
  { image: 'nova-3.jpg', alt: 'Nova peering over a cardboard box with a lopsided, half-open-mouthed look', tag: 'Nova', date: '13 July 2026' },
  { image: 'nova-4.jpg', alt: 'Nova asleep, curled up on a rumpled red blanket on the sofa', tag: 'Nova', date: '13 July 2026' },
  { image: 'nova-5.jpg', alt: 'Nova’s green eyes and pink nose peeking over the edge of a white box', tag: 'Nova', date: '10 March 2026' },
  { image: 'nova-6.jpg', alt: 'Nova peeking out from under a soft gray blanket on the bed', tag: 'Nova', date: '5 October 2026' },
  { image: 'luci-1.jpg', alt: 'Luci, a white cat with ginger patches over the ears and eyes, squinting one eye at the camera', tag: 'Luci', date: '5 July 2026' },
  { image: 'luci-2.jpg', alt: 'Luci stretched out upside down across a cat tree, pink paw pads in the air', tag: 'Luci', date: '7 April 2026' },
  { image: 'luci-3.jpg', alt: 'Luci sitting wide-eyed facing the camera against a dark gray curtain', tag: 'Luci', date: '25 March 2026' },
  { image: 'luci-4.jpg', alt: 'Luci lying on blue-patterned bedding, a paw over the face and the tongue poking out', tag: 'Luci', date: '24 March 2026' },
  { image: 'luci-5.jpg', alt: 'Luci lit by a sunbeam, looking off to the side against a dark background', tag: 'Luci', date: '25 March 2026' },
  { image: 'luci-6.jpg', alt: 'Luci asleep, curled up on a red blanket on the sofa', tag: 'Luci', date: '13 July 2026' },
];

