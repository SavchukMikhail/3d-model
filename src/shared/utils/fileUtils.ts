export class FileUtils {
  public static fileReader = new FileReader();

  public static async loadFileAsText(file: File) {
    return new Promise<string>((res, rej) => {
      FileUtils.fileReader.readAsText(file);

      FileUtils.fileReader.onload = (e) => {
        if (e.target === null) {
          rej();
          return;
        }

        const csvData = e.target.result as string;

        res(csvData);
      };
    });
  }

  public static async loadFileAsArrayBuffer(file: File) {
    return new Promise<ArrayBuffer>((res, rej) => {
      FileUtils.fileReader.readAsArrayBuffer(file);

      FileUtils.fileReader.onload = (e) => {
        if (e.target === null) {
          rej();
          return;
        }

        const csvData = e.target.result as ArrayBuffer;

        res(csvData);
      };
    });
  }
}
