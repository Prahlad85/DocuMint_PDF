const fs = require('fs-extra');
const path = require('path');

async function cleanup(tmpDir, req) {
  if (tmpDir) await fs.remove(tmpDir).catch(console.error);
  if (req.file) await fs.remove(req.file.path).catch(console.error);
  if (req.files) {
    if (Array.isArray(req.files)) {
      for (const f of req.files) await fs.remove(f.path).catch(console.error);
    } else {
      for (const key in req.files) {
        for (const f of req.files[key]) await fs.remove(f.path).catch(console.error);
      }
    }
  }
}

exports.processAndSend = async (req, res, processor) => {
  let tmpDir = null;
  try {
    if (!req.file && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ error: 'File is required' });
    }
    tmpDir = await fs.mkdtemp(path.join(__dirname, '../uploads/task-'));
    
    const result = await processor(tmpDir);
    
    if (result.type === 'json') {
      res.json(result.data);
      cleanup(tmpDir, req);
    } else {
      res.download(result.path, result.filename, (err) => {
        if (err) console.error('Download error:', err);
        cleanup(tmpDir, req);
      });
    }
  } catch (error) {
    console.error('Processing Error:', error);
    res.status(500).json({ error: error.message });
    cleanup(tmpDir, req);
  }
};
