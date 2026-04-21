const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const parseResume = async (buffer, mimetype) => {
  try {
    if (mimetype === 'application/pdf') {
      const data = await pdfParse(buffer);
      return data.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    throw new Error('Failed to parse document: ' + error.message);
  }
};

module.exports = { parseResume };
