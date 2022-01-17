import mongoose, { Connection } from 'mongoose';

interface ConnectProps {
  host: string;
  onOpen?(): void;
  onClose?(): void;
  onError?(): void;
}

export default class DataBase {
  static _singletonInstance: DataBase;
  private connection: Connection = mongoose.connection;

  constructor() {
    return DataBase._singletonInstance ?? (DataBase._singletonInstance = this);
  }

  async connect(props: ConnectProps) {
    this.connection.on('open', () => props.onOpen?.());
    this.connection.on('close', () => props.onClose?.());
    this.connection.on('error', () => props.onError?.());

    return mongoose.connect(props.host);
  }

  close() {
    this.connection.close();
  }
}