import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseCtrl = {
  /**
   * Serves the base HTML page.
   */
  basePage: (req, res) => {
    res.status(200).json("Hello this is alan, Ian, Lisandro, Youssef")
  },
};

export default baseCtrl;
