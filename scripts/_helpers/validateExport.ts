import type FileMetaType from '../_types/FileMetaType';
import temporaryExcludes from './temporaryExcludes';

const validateExport = (files: FileMetaType[]): string[] => {
  const errors = files
    .filter(
      (entry) => !temporaryExcludes.internalFiles.includes(entry.fileName)
    )
    .map((file) => {
      const exportCount = (file.content.match(/export/g) || []).length;
      const exportDefaultIdx = file.content.indexOf('export default');

      if (exportCount > 1 || exportDefaultIdx === -1) {
        return `${file.fileNameExt} has incorrect exports`;
      }

      const exportDefaultLine = file.content.slice(exportDefaultIdx);
      const exportDefaultName = exportDefaultLine.slice(
        exportDefaultLine.lastIndexOf(' ') + 1,
        exportDefaultLine.indexOf(';')
      );

      if (exportDefaultName !== file.fileName) {
        return `${file.fileNameExt} has incorrect named default export: ${exportDefaultName}`;
      }

      return '';
    })
    .filter((entry) => entry !== '');

  return errors;
};

export default validateExport;
