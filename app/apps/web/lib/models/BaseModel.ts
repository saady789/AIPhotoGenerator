export abstract class BaseModel {
  abstract generateImage(prompt: string, tensorPath: string): Promise<any>;
  abstract trainModel(zipUrl: string, triggerWord: string): Promise<any>;
}
