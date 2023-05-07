import path from 'path';
import express, { type Response, type Request } from 'express';
import multer, { type FileFilterCallback } from 'multer';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

interface CustomRequest extends Request {
  file?: Express.Multer.File | undefined;
}

const router = express.Router();

export const storage = multer.diskStorage({
  destination: (
    request: Request,
    file: Express.Multer.File,
    cb: DestinationCallback,
  ): void => {
    cb(null, 'uploads/');
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: FileNameCallback,
  ): void => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

export const checkFileType = (
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  return cb(null, false);
};

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post(
  '/',
  upload.single('image'),
  (req: CustomRequest, res: Response) => {
    const { file } = req;
    if (file === undefined || file === null) throw new Error('User not found');
    res.send(`/${file?.path}`);
  },
);

export default router;
