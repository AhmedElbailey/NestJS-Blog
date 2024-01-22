import { diskStorage } from 'multer';

export const profileImageStorageOptions = {
  storage: diskStorage({
    destination: './uploads/profileimages',
    filename: (req, file, cb) => {
      const [filename, extension] = file.originalname.split('.');
      const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e5);
      cb(null, `${filename}-${uniqueSuffix}.${extension}`);
    },
  }),
};
export const blogEntryImageStorageOptions = {
  storage: diskStorage({
    destination: './uploads/blog-entry-images',
    filename: (req, file, cb) => {
      const [filename, extension] = file.originalname.split('.');
      const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e5);
      cb(null, `${filename}-${uniqueSuffix}.${extension}`);
    },
  }),
};
